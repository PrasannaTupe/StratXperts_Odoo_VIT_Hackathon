from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from passlib.context import CryptContext

import models
import schemas
from database import get_db

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/users", tags=["User Management"])

# --- Endpoints ---

@router.post("/create", response_model=schemas.UserOut)
def create_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Creates a new team member in the MySQL database.
    Logic: Checks for existing email, hashes the password, and links to company_id.
    """
    
    # 1. Check if email already exists
    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="This email is already registered in your organization.")

    # 2. Hash the password for security
    hashed_password = pwd_context.hash(data.password)

    # 3. Create the User instance (Mapping Schema to Model)
    new_user = models.User(
        company_id=data.company_id,
        name=data.name,
        email=data.email,
        password_hash=hashed_password,
        role=data.role,
        manager_id=data.manager_id,
        is_manager_approver=data.is_manager_approver
    )
    
    try:
        # 4. Save to MySQL Workbench
        db.add(new_user)
        db.commit() 
        db.refresh(new_user)
        return new_user
    except Exception as e:
        db.rollback()  # Undo changes if database fails
        print(f"CRITICAL DB ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail="Database rejected the member update. Check server logs.")

@router.get("/company/{company_id}", response_model=List[schemas.UserOut])
def get_company_users(company_id: int, db: Session = Depends(get_db)):
    """
    Fetches the team list for a specific company ID.
    Used by the React 'Manage Team' table.
    """
    users = db.query(models.User).filter(models.User.company_id == company_id).all()
    # Return empty list if no users found to avoid frontend crashes
    if not users:
        return []
    return users