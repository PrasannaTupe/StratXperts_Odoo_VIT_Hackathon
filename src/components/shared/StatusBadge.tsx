import { Check, X, Clock, FileEdit, Eye } from 'lucide-react';
import { ExpenseStatus } from '@/data/types';

const statusConfig: Record<ExpenseStatus, { label: string; className: string; icon: React.ReactNode }> = {
  approved: { label: 'Approved', className: 'bg-status-approved/20 text-status-approved', icon: <Check className="w-3 h-3" /> },
  rejected: { label: 'Rejected', className: 'bg-status-rejected/20 text-status-rejected', icon: <X className="w-3 h-3" /> },
  pending: { label: 'Pending', className: 'bg-status-pending/20 text-status-pending animate-pulse-status', icon: <Clock className="w-3 h-3" /> },
  in_review: { label: 'In Review', className: 'bg-status-in-review/20 text-status-in-review', icon: <Eye className="w-3 h-3" /> },
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground', icon: <FileEdit className="w-3 h-3" /> },
};

interface StatusBadgeProps {
  status: ExpenseStatus;
  size?: 'sm' | 'md';
}

const StatusBadge = ({ status, size = 'sm' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.className} ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
