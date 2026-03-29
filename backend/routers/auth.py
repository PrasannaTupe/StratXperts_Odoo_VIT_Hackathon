from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr

import models
from database import get_db

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/auth", tags=["Authentication"])

# --- Custom Schemas for Auth ---
class AdminSignupRequest(BaseModel):
    company_name: str
    country: str
    currency: str
    admin_name: str
    admin_email: EmailStr
    admin_password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# --- Endpoints ---
@router.post("/signup")
def signup_admin_and_company(data: AdminSignupRequest, db: Session = Depends(get_db)):
    # 1. Check if the email is already registered
    existing_user = db.query(models.User).filter(models.User.email == data.admin_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Create the Company first (since the User needs a company_id)
    new_company = models.Company(
        name=data.company_name,
        country=data.country,
        currency=data.currency # From the country dropdown API on frontend
    )
    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    # 3. Hash the password and create the Admin User
    hashed_password = pwd_context.hash(data.admin_password)
    new_admin = models.User(
        company_id=new_company.id,
        name=data.admin_name,
        email=data.admin_email,
        password_hash=hashed_password,
        role=models.RoleEnum.admin,
        is_manager_approver=True # Admins can generally approve things
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {
        "message": "Company and Admin created successfully!",
        "company_id": new_company.id,
        "admin_id": new_admin.id
    }

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # 1. Find the user
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Verify password
    if not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Hackathon Shortcut: Instead of setting up complex JWTs right now, 
    # we return the user details. The React frontend can store this in localStorage.
    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "company_id": user.company_id,
            "currency": user.company.currency if user.company else "INR"
        }
    }