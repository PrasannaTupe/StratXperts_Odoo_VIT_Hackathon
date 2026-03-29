from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from datetime import datetime

router = APIRouter(prefix="/approvals", tags=["Manager Approvals"])

@router.get("/pending/{manager_id}")
def get_pending_approvals(manager_id: int, db: Session = Depends(get_db)):
    # Hackathon Logic: Find all pending expenses where this user is the assigned manager
    users_managed = db.query(models.User).filter(models.User.manager_id == manager_id).all()
    user_ids = [u.id for u in users_managed]
    
    pending_expenses = db.query(models.Expense).filter(
        models.Expense.user_id.in_(user_ids),
        models.Expense.status == models.StatusEnum.pending
    ).all()
    
    return pending_expenses

@router.post("/{expense_id}/action")
def process_approval(expense_id: int, data: schemas.ApprovalAction, db: Session = Depends(get_db)):
    # 1. Find the current pending step for this manager [cite: 35]
    current_step = db.query(models.ExpenseApproval).filter(
        models.ExpenseApproval.expense_id == expense_id,
        models.ExpenseApproval.approver_id == data.manager_id,
        models.ExpenseApproval.status == models.StatusEnum.pending
    ).first()

    if not current_step:
        raise HTTPException(status_code=403, detail="It is not your turn to approve this expense.")

    # 2. Record the action [cite: 36]
    current_step.status = data.action
    current_step.comments = data.comments
    current_step.acted_at = datetime.now()

    if data.action == models.StatusEnum.rejected:
        # If one person rejects, the whole expense is dead 
        expense = db.query(models.Expense).get(expense_id)
        expense.status = models.StatusEnum.rejected
    else:
        # 3. THE HAND-OFF LOGIC 
        next_step = db.query(models.ExpenseApproval).filter(
            models.ExpenseApproval.expense_id == expense_id,
            models.ExpenseApproval.step_order == current_step.step_order + 1
        ).first()

        if next_step:
            # Move to the next person in sequence
            next_step.status = models.StatusEnum.pending
        else:
            # No more steps? The expense is officially fully approved!
            expense = db.query(models.Expense).get(expense_id)
            expense.status = models.StatusEnum.approved

    db.commit()
    return {"message": "Action recorded successfully."}