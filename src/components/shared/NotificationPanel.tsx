import { mockNotifications } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ open, onClose }: NotificationPanelProps) => (
  <AnimatePresence>
    {open && (
      <>
        <div className="fixed inset-0 z-40" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute right-0 top-12 w-80 glass-card p-0 overflow-hidden z-50"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <button className="text-xs text-primary hover:underline flex items-center gap-1">
              <Check className="w-3 h-3" /> Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-auto divide-y divide-border">
            {mockNotifications.map(n => (
              <div key={n.id} className={`p-4 text-sm ${n.read ? '' : 'bg-primary/5'}`}>
                <p className={n.read ? 'text-muted-foreground' : 'text-foreground'}>{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default NotificationPanel;
