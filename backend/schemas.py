from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
from enums import RoleEnum, StatusEnum, RuleTypeEnum # Ensure these match enums.py

# --- COMPANY SCHEMAS ---
class CompanyBase(BaseModel):
    name: str
    currency: Optional[str] = "INR"
    country: str

class CompanyOut(CompanyBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- USER SCHEMAS ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    company_id: int
    role: Optional[RoleEnum] = RoleEnum.employee
    manager_id: Optional[int] = None
    is_manager_approver: Optional[bool] = False

class UserOut(BaseModel):
    id: int
    company_id: int
    name: str
    email: EmailStr
    role: RoleEnum
    manager_id: Optional[int] = None
    is_manager_approver: bool
    
    class Config:
        from_attributes = True

# --- EXPENSE SCHEMAS ---
class ExpenseCreate(BaseModel):
    amount: float
    currency: str
    category: str
    description: str
    expense_date: date
    receipt_url: Optional[str] = None

class ExpenseOut(BaseModel):
    id: int
    user_id: int
    company_id: int
    amount: float
    currency: str
    amount_in_company_currency: float
    category: str
    description: str
    expense_date: date
    status: StatusEnum
    is_anomaly: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- APPROVAL & WORKFLOW SCHEMAS (FIXED) ---
class RuleCreate(BaseModel):
    name: str
    rule_type: RuleTypeEnum
    threshold_percentage: Optional[int] = None
    min_amount: Optional[float] = 0.0
    approver_ids: List[int] # This matches what your router needs

class ApprovalAction(BaseModel):
    manager_id: int
    action: StatusEnum
    comments: Optional[str] = None

# --- AI & CHAT SCHEMAS ---
class ChatRequest(BaseModel):
    user_id: int
    message: str