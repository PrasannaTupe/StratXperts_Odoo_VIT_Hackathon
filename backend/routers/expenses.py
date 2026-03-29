from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import requests
from datetime import datetime
from sqlalchemy import text
import models
import schemas
from database import get_db
from enums import StatusEnum

router = APIRouter(prefix="/expenses", tags=["Expenses"])

# Helper for Live Currency Conversion
def get_exchange_rate(base_currency: str, target_currency: str):
    if not base_currency or not target_currency or base_currency.upper() == target_currency.upper(): 
        return 1.0
    try:
        url = f"https://api.exchangerate-api.com/v4/latest/{base_currency.upper()}"
        response = requests.get(url, timeout=5)
        data = response.json()
        return float(data['rates'].get(target_currency.upper(), 1.0))
    except Exception:
        return 1.0 

# --- 1. SUBMIT EXPENSE (Employee Page) ---
@router.post("/submit", response_model=schemas.ExpenseOut)
def submit_expense(data: schemas.ExpenseCreate, user_id: int, db: Session = Depends(get_db)):
    print(f"--- ATTEMPTING DB WRITE --- User: {user_id}")
    
    # 1. Verify User exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        print("Fallback: User ID not found, using first available user")
        user = db.query(models.User).first()
        if not user:
            raise HTTPException(status_code=400, detail="No users exist in DB. Please seed users table.")

    # 2. Handle Currency and Company
    company_currency = "INR"
    company_id = 1
    if user.company_id:
        company_id = user.company_id
        company = db.query(models.Company).filter(models.Company.id == user.company_id).first()
        if company:
            company_currency = company.currency

    rate = get_exchange_rate(data.currency, company_currency)
    converted_amount = round(float(data.amount) * rate, 2)

    try:
        # 3. Create the Main Expense Record
        new_expense = models.Expense(
            user_id=user.id,
            company_id=company_id,
            amount=float(data.amount),
            currency=data.currency.upper(),
            amount_in_company_currency=converted_amount,
            category=data.category,
            description=data.description,
            expense_date=data.expense_date,
            status="pending", # Ensuring string matches DB expectations
            is_anomaly=False
        )
        
        db.add(new_expense)
        db.flush() # This generates the Expense ID without closing the transaction
        print(f"--- EXPENSE ADDED: ID {new_expense.id} ---")

        # 4. Create the Approval Entry (For Manager View)
        # We use a fallback manager ID (2) if user.manager_id is null
        target_manager = user.manager_id if user.manager_id else 2
        
        approval_task = models.ExpenseApproval(
            expense_id=new_expense.id,
            approver_id=target_manager,
            step_order=1,
            status="pending"
        )
        db.add(approval_task)
        
        # 5. COMMIT EVERYTHING TO MYSQL
        db.commit()
        db.refresh(new_expense)
        print("--- DATABASE FULLY UPDATED ---")
        return new_expense

    except Exception as e:
        db.rollback()
        print(f"!!! CRITICAL DB ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database Update Failed: {str(e)}")

# --- 2. MY EXPENSES (Dashboard List) ---
@router.get("/my-expenses/{user_id}")
def get_my_expenses(user_id: int, db: Session = Depends(get_db)):
    # In Demo mode, we fetch all to show the UI is working
    expenses = db.query(models.Expense).order_by(models.Expense.created_at.desc()).all()
    return [{
        "id": e.id,
        "description": e.description,
        "category": e.category,
        "amount": float(e.amount),
        "currency": e.currency,
        "amount_in_company_currency": float(e.amount_in_company_currency),
        "status": e.status,
        "expense_date": str(e.expense_date)
    } for e in expenses]

# --- 3. PENDING APPROVALS (Manager Review) ---
@router.get("/approvals/pending/{manager_id}")
def get_manager_pending(manager_id: int, db: Session = Depends(get_db)):
    pending_data = db.query(models.Expense, models.ExpenseApproval).join(
        models.ExpenseApproval, models.Expense.id == models.ExpenseApproval.expense_id
    ).filter(
        models.ExpenseApproval.approver_id == manager_id,
        models.ExpenseApproval.status == "pending"
    ).all()

    return [{
        "id": exp.id,
        "approval_id": app.id,
        "description": exp.description,
        "employee_name": db.query(models.User.name).filter(models.User.id == exp.user_id).scalar() or "Employee",
        "category": exp.category,
        "status": "pending",
        "amount": float(exp.amount),
        "currency": exp.currency,
        "amount_in_company_currency": float(exp.amount_in_company_currency),
        "expense_date": str(exp.expense_date)
    } for exp, app in pending_data]

# --- 4. APPROVE/REJECT (Manager Action) ---
@router.post("/approvals/action")
def approve_reject_expense(approval_id: int, action: str, comments: str = None, db: Session = Depends(get_db)):
    app_entry = db.query(models.ExpenseApproval).filter(models.ExpenseApproval.id == approval_id).first()
    
    if not app_entry:
        # Emergency Check: Try finding by expense_id if approval_id fails
        expense = db.query(models.Expense).filter(models.Expense.id == approval_id).first()
    else:
        app_entry.status = action
        app_entry.comments = comments
        expense = db.query(models.Expense).filter(models.Expense.id == app_entry.expense_id).first()

    if expense:
        expense.status = action
    
    try:
        db.commit()
        return {"status": "success", "message": f"Successfully updated to {action}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database update failed")

# --- 5. ADMIN OVERVIEW ---
@router.get("/admin/all-expenses/{company_id}")
def get_admin_overview(company_id: int, db: Session = Depends(get_db)):
    expenses = db.query(models.Expense).filter(models.Expense.company_id == company_id).all()
    return [{
        "id": e.id,
        "user_id": e.user_id,
        "description": e.description,
        "category": e.category,
        "amount": float(e.amount),
        "amount_in_company_currency": float(e.amount_in_company_currency),
        "status": e.status,
        "expense_date": str(e.expense_date)
    } for e in expenses]

# --- 6. DETAILS ---
@router.get("/{expense_id}")
def get_expense_detail(expense_id: int, db: Session = Depends(get_db)):
    e = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Not found")
    return {
        "id": e.id,
        "description": e.description,
        "category": e.category,
        "amount": float(e.amount),
        "currency": e.currency,
        "amount_in_company_currency": float(e.amount_in_company_currency),
        "status": e.status,
        "expense_date": str(e.expense_date)
    }