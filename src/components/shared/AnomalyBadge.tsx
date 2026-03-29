import { AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const AnomalyBadge = () => (
  <Tooltip>
    <TooltipTrigger>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-pending/20 text-status-pending text-xs font-medium">
        <AlertTriangle className="w-3 h-3" />
        AI Flagged
      </span>
    </TooltipTrigger>
    <TooltipContent>
      <p className="text-xs">AI flagged this as unusual based on expense history</p>
    </TooltipContent>
  </Tooltip>
);

export default AnomalyBadge;
