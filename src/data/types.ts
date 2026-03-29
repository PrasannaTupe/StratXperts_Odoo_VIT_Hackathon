export type ExpenseStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'in_review';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  currency: string;
  amount_in_company_currency: number;
  category: string;
  status: ExpenseStatus;
  is_anomaly: boolean;
  date: string;
  paid_by: string;
  remarks: string;
  receipt_url?: string;
  employee_name?: string;
  manager_name?: string;
}

export interface ApprovalStep {
  id: number;
  expense_id: number;
  step_number: number;
  approver_name: string;
  approver_role: string;
  status: 'approved' | 'rejected' | 'pending' | 'not_reached';
  comment: string | null;
  acted_at: string | null;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

export interface ApprovalRule {
  id: number;
  name: string;
  description: string;
  type: 'sequential' | 'percentage' | 'hybrid';
  approver_count: number;
  min_amount: number;
  max_amount: number;
  manager: string;
  approvers: { id: number; name: string; required: boolean }[];
  sequential: boolean;
  min_percentage: number;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  manager: string | null;
  status: 'active' | 'inactive';
  is_approver?: boolean;
}

export const EXPENSE_CATEGORIES = [
  'Travel', 'Food & Dining', 'Accommodation', 'Office Supplies',
  'Software', 'Medical', 'Training', 'Miscellaneous'
] as const;
