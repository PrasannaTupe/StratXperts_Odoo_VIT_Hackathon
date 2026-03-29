import { Expense, ApprovalStep, Notification, ApprovalRule, TeamMember } from './types';

export const mockExpenses: Expense[] = [
  { id: 1, description: 'Team lunch at Taj', amount: 3500, currency: 'INR', amount_in_company_currency: 3500, category: 'Food & Dining', status: 'approved', is_anomaly: false, date: '2025-06-10', paid_by: 'Amit Kumar', remarks: 'Team celebration', employee_name: 'Amit Kumar', manager_name: 'Priya Patel' },
  { id: 2, description: 'AWS subscription', amount: 120, currency: 'USD', amount_in_company_currency: 9960, category: 'Software', status: 'pending', is_anomaly: false, date: '2025-06-12', paid_by: 'Amit Kumar', remarks: 'Monthly cloud subscription', employee_name: 'Amit Kumar', manager_name: 'Priya Patel' },
  { id: 3, description: 'International conference', amount: 85000, currency: 'INR', amount_in_company_currency: 85000, category: 'Travel', status: 'pending', is_anomaly: true, date: '2025-06-14', paid_by: 'Amit Kumar', remarks: 'AI Summit 2025', employee_name: 'Amit Kumar', manager_name: 'Priya Patel' },
  { id: 4, description: 'Office supplies - pens & notebooks', amount: 450, currency: 'INR', amount_in_company_currency: 450, category: 'Office Supplies', status: 'approved', is_anomaly: false, date: '2025-06-08', paid_by: 'Neha Singh', remarks: '', employee_name: 'Neha Singh', manager_name: 'Priya Patel' },
  { id: 5, description: 'Taxi to airport', amount: 1200, currency: 'INR', amount_in_company_currency: 1200, category: 'Travel', status: 'rejected', is_anomaly: false, date: '2025-06-05', paid_by: 'Vikram Joshi', remarks: 'Client meeting travel', employee_name: 'Vikram Joshi', manager_name: 'Priya Patel' },
  { id: 6, description: 'Figma Pro annual', amount: 144, currency: 'USD', amount_in_company_currency: 11952, category: 'Software', status: 'draft', is_anomaly: false, date: '2025-06-15', paid_by: 'Amit Kumar', remarks: 'Design tool license', employee_name: 'Amit Kumar', manager_name: 'Priya Patel' },
];

export const mockApprovalSteps: ApprovalStep[] = [
  { id: 1, expense_id: 2, step_number: 1, approver_name: 'Priya Patel', approver_role: 'Manager', status: 'approved', comment: 'Looks good, approved', acted_at: '2025-06-12T10:30:00Z' },
  { id: 2, expense_id: 2, step_number: 2, approver_name: 'Finance Team', approver_role: 'Finance', status: 'pending', comment: null, acted_at: null },
  { id: 3, expense_id: 2, step_number: 3, approver_name: 'Director', approver_role: 'Director', status: 'not_reached', comment: null, acted_at: null },
];

export const mockNotifications: Notification[] = [
  { id: 1, message: 'Expense #2 approved by Priya Patel', time: '2 min ago', read: false },
  { id: 2, message: 'New expense submitted by Amit Kumar', time: '15 min ago', read: false },
  { id: 3, message: 'Expense #5 rejected — see comments', time: '1 hour ago', read: true },
  { id: 4, message: 'Monthly expense report is ready', time: '3 hours ago', read: true },
];

export const mockRules: ApprovalRule[] = [
  { id: 1, name: 'Standard Expense Approval', description: 'For expenses under 10,000 INR', type: 'sequential', approver_count: 2, min_amount: 0, max_amount: 10000, manager: 'Priya Patel', approvers: [{ id: 1, name: 'Priya Patel', required: true }, { id: 2, name: 'Finance Team', required: true }], sequential: true, min_percentage: 0 },
  { id: 2, name: 'High Value Approval', description: 'For expenses above 10,000 INR', type: 'hybrid', approver_count: 3, min_amount: 10000, max_amount: 100000, manager: 'Priya Patel', approvers: [{ id: 1, name: 'Priya Patel', required: true }, { id: 2, name: 'Finance Team', required: true }, { id: 3, name: 'Director', required: false }], sequential: true, min_percentage: 60 },
];

export const mockTeamMembers: TeamMember[] = [
  { id: 1, name: 'Rahul Sharma', email: 'admin@acme.com', role: 'admin', manager: null, status: 'active' },
  { id: 2, name: 'Priya Patel', email: 'manager@acme.com', role: 'manager', manager: null, status: 'active', is_approver: true },
  { id: 3, name: 'Amit Kumar', email: 'employee@acme.com', role: 'employee', manager: 'Priya Patel', status: 'active' },
  { id: 4, name: 'Neha Singh', email: 'neha@acme.com', role: 'employee', manager: 'Priya Patel', status: 'active' },
  { id: 5, name: 'Vikram Joshi', email: 'vikram@acme.com', role: 'employee', manager: 'Priya Patel', status: 'active' },
];
