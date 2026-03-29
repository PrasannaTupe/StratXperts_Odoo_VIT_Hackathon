from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter(prefix="/rules", tags=["Approval Rules"])

@router.post("/create")
def create_rule(data: schemas.RuleCreate, company_id: int, db: Session = Depends(get_db)):
    # 1. Create the base rule
    new_rule = models.ApprovalRule(
        company_id=company_id,
        name=data.name,
        rule_type=data.rule_type,
        threshold_percentage=data.threshold_percentage,
    )
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)

    # 2. Map the sequential steps [cite: 24]
    for index, approver_id in enumerate(data.approver_ids):
        step = models.ApprovalStep(
            rule_id=new_rule.id,
            approver_id=approver_id,
            step_order=index + 1 # Step 1, Step 2, etc.
        )
        db.add(step)
    
    db.commit()
    return {"message": "Approval rule sequence created successfully!", "rule_id": new_rule.id}