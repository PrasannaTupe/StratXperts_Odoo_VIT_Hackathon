# backend/enums.py
import enum

class RoleEnum(str, enum.Enum):
    admin = "admin"
    manager = "manager"
    employee = "employee"

class StatusEnum(str, enum.Enum):
    pending = "pending"
    in_review = "in_review"
    approved = "approved"
    rejected = "rejected"

class RuleTypeEnum(str, enum.Enum):
    sequential = "sequential"
    percentage = "percentage"
    specific_approver = "specific_approver"
    hybrid = "hybrid"