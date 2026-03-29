from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum, Text, Date, JSON, DateTime
from sqlalchemy.sql import func
from database import Base
from enums import RoleEnum, StatusEnum, RuleTypeEnum

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    currency = Column(String(10), default="INR")
    country = Column(String(100))
    created_at = Column(DateTime, default=func.now())

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    name = Column(String(255))
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(Enum(RoleEnum), default=RoleEnum.employee)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_manager_approver = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    company_id = Column(Integer, ForeignKey("companies.id"))
    amount = Column(Float)
    currency = Column(String(10))
    amount_in_company_currency = Column(Float)
    category = Column(String(100))
    description = Column(Text)
    expense_date = Column(Date)
    status = Column(String(50), default="pending") # Matches StatusEnum
    receipt_url = Column(String(500), nullable=True)
    is_anomaly = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

# --- THE MISSING TABLES START HERE ---

class ExpenseApproval(Base):
    __tablename__ = "expense_approvals"
    id = Column(Integer, primary_key=True, index=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"))
    approver_id = Column(Integer, ForeignKey("users.id"))
    step_order = Column(Integer, default=1)
    status = Column(String(50), default="pending") 
    comments = Column(Text, nullable=True)

class ApprovalRule(Base):
    __tablename__ = "approval_rules"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    name = Column(String(255))
    rule_type = Column(Enum(RuleTypeEnum))
    min_amount = Column(Float, default=0.0)

class ApprovalStep(Base):
    __tablename__ = "approval_steps"
    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(Integer, ForeignKey("approval_rules.id"))
    approver_id = Column(Integer, ForeignKey("users.id"))
    step_order = Column(Integer)