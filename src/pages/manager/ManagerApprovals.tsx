import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronDown, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import CurrencyDisplay from '@/components/shared/CurrencyDisplay';
import AnomalyBadge from '@/components/shared/AnomalyBadge';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { mockExpenses } from '@/data/mockData';
import { Expense, ExpenseStatus } from '@/data/types';
import toast from 'react-hot-toast';

const ManagerApprovals = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [filter, setFilter] = useState<'all' | ExpenseStatus>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [actionModal, setActionModal] = useState<{ id: number; action: 'approved' | 'rejected' } | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => { document.title = 'ReimburseAI — Approvals'; }, []);

  const filtered = expenses.filter(e => filter === 'all' || e.status === filter);
  const pendingCount = expenses.filter(e => e.status === 'pending').length;

  const handleAction = () => {
    if (!actionModal) return;
    setExpenses(prev => prev.map(e => e.id === actionModal.id ? { ...e, status: actionModal.action } : e));
    toast.success(`Expense ${actionModal.action}`, {
      duration: 3000,
      icon: actionModal.action === 'approved' ? '✅' : '❌',
    });
    setActionModal(null);
    setComment('');
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ] as const;

  return (
    <div className="pb-20 lg:pb-0 space-y-6">
      <PageHeader title="Approvals to Review" subtitle={`${pendingCount} pending approvals`} />

      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === t.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['', 'Subject', 'Owner', 'Category', 'Status', 'Amount', 'Actions'].map(h => (
                <th key={h} className="text-left p-4 text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(exp => (
              <>
                <tr key={exp.id} className={`border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${exp.is_anomaly ? 'border-l-2 border-l-status-pending' : ''}`} onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}>
                  <td className="p-4"><ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedId === exp.id ? 'rotate-180' : ''}`} /></td>
                  <td className="p-4 font-medium">{exp.description}</td>
                  <td className="p-4 text-muted-foreground">{exp.employee_name}</td>
                  <td className="p-4 text-muted-foreground">{exp.category}</td>
                  <td className="p-4"><StatusBadge status={exp.status} /></td>
                  <td className="p-4">
                    <CurrencyDisplay amount={exp.amount_in_company_currency} currency="INR" />
                    {exp.is_anomaly && <div className="mt-1"><AnomalyBadge /></div>}
                  </td>
                  <td className="p-4" onClick={e => e.stopPropagation()}>
                    {exp.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => setActionModal({ id: exp.id, action: 'approved' })} className="px-3 py-1.5 rounded-lg bg-status-approved/20 text-status-approved text-xs font-medium hover:bg-status-approved/30 transition-colors">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setActionModal({ id: exp.id, action: 'rejected' })} className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/30 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedId === exp.id && (
                    <tr key={`${exp.id}-detail`}>
                      <td colSpan={7} className="p-0">
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-6 bg-muted/20 border-b border-border grid sm:grid-cols-3 gap-4">
                            <div><p className="text-xs text-muted-foreground mb-1">Description</p><p className="text-sm">{exp.description}</p></div>
                            <div><p className="text-xs text-muted-foreground mb-1">Date</p><p className="text-sm">{exp.date}</p></div>
                            <div><p className="text-xs text-muted-foreground mb-1">Remarks</p><p className="text-sm">{exp.remarks || '—'}</p></div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground">No approvals to show</div>}
      </motion.div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(exp => (
          <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`glass-card p-4 space-y-3 ${exp.is_anomaly ? 'border-l-2 border-l-status-pending' : ''}`}>
            <div className="flex justify-between items-start">
              <div><p className="font-medium text-sm">{exp.description}</p><p className="text-xs text-muted-foreground">{exp.employee_name} · {exp.date}</p></div>
              <StatusBadge status={exp.status} />
            </div>
            <div className="flex justify-between items-center">
              <CurrencyDisplay amount={exp.amount_in_company_currency} currency="INR" />
              {exp.is_anomaly && <AnomalyBadge />}
            </div>
            {exp.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => setActionModal({ id: exp.id, action: 'approved' })} className="flex-1 py-2 rounded-lg bg-status-approved/20 text-status-approved text-xs font-medium text-center">Approve</button>
                <button onClick={() => setActionModal({ id: exp.id, action: 'rejected' })} className="flex-1 py-2 rounded-lg bg-destructive/20 text-destructive text-xs font-medium text-center">Reject</button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Action Modal */}
      <ConfirmModal
        open={actionModal !== null}
        title={actionModal?.action === 'approved' ? 'Approve Expense' : 'Reject Expense'}
        confirmLabel={actionModal?.action === 'approved' ? 'Approve' : 'Reject'}
        confirmVariant={actionModal?.action === 'approved' ? 'success' : 'destructive'}
        onConfirm={handleAction}
        onCancel={() => { setActionModal(null); setComment(''); }}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1.5">Add a comment (optional)</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Any notes..." className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border resize-none placeholder:text-muted-foreground" />
        </div>
      </ConfirmModal>
    </div>
  );
};

export default ManagerApprovals;
