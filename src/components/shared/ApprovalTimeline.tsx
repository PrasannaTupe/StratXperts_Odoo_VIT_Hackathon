import { ApprovalStep } from '@/data/types';
import { Check, X, Clock, Circle } from 'lucide-react';

interface ApprovalTimelineProps {
  steps: ApprovalStep[];
}

const stepConfig = {
  approved: { icon: Check, color: 'text-status-approved', bg: 'bg-status-approved', line: 'bg-status-approved' },
  rejected: { icon: X, color: 'text-status-rejected', bg: 'bg-status-rejected', line: 'bg-status-rejected' },
  pending: { icon: Clock, color: 'text-status-pending', bg: 'bg-status-pending', line: 'bg-muted' },
  not_reached: { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted', line: 'bg-muted' },
};

const ApprovalTimeline = ({ steps }: ApprovalTimelineProps) => (
  <div className="space-y-0">
    {steps.map((step, i) => {
      const config = stepConfig[step.status];
      const Icon = config.icon;
      return (
        <div key={step.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg}/20`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 h-12 ${step.status === 'not_reached' ? 'border-l-2 border-dashed border-muted' : config.line}`} />
            )}
          </div>
          <div className="pb-8">
            <p className="font-medium text-sm">
              Step {step.step_number} — {step.approver_name} ({step.approver_role})
            </p>
            <p className={`text-xs ${config.color} uppercase font-semibold`}>{step.status.replace('_', ' ')}</p>
            {step.acted_at && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(step.acted_at).toLocaleString()}
              </p>
            )}
            {step.comment && <p className="text-xs text-muted-foreground mt-1 italic">"{step.comment}"</p>}
          </div>
        </div>
      );
    })}
  </div>
);

export default ApprovalTimeline;
