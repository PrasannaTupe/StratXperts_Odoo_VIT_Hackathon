import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: 'destructive' | 'primary' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

const variantClasses = {
  destructive: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
  primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
  success: 'bg-status-approved hover:bg-status-approved/90 text-primary-foreground',
};

const ConfirmModal = ({ open, title, description, confirmLabel = 'Confirm', confirmVariant = 'primary', onConfirm, onCancel, children }: ConfirmModalProps) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onCancel} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-card p-6 w-full max-w-md z-50 relative">
          <button onClick={onCancel} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
          {children}
          <div className="flex gap-3 justify-end mt-6">
            <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 transition-colors">Cancel</button>
            <button onClick={onConfirm} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.03] ${variantClasses[confirmVariant]}`}>{confirmLabel}</button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default ConfirmModal;
