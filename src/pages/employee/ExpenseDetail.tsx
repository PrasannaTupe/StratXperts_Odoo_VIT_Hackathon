import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import CurrencyDisplay from '@/components/shared/CurrencyDisplay';
import ApprovalTimeline from '@/components/shared/ApprovalTimeline';
import { mockExpenses, mockApprovalSteps } from '@/data/mockData';

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const expense = mockExpenses.find(e => e.id === Number(id)) || mockExpenses[0];

  useEffect(() => { document.title = `ReimburseAI — Expense #${id}`; }, [id]);

  return (
    <div className="pb-20 lg:pb-0 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{expense.description}</h1>
          <p className="text-sm text-muted-foreground mt-1">Submitted on {expense.date}</p>
        </div>
        <StatusBadge status={expense.status} size="md" />
      </div>

      {expense.is_anomaly && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-status-pending/10 border border-status-pending/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-status-pending shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-status-pending">AI Anomaly Detected</p>
            <p className="text-xs text-muted-foreground mt-1">This expense was flagged by our AI as unusual. A reviewer will give it extra attention.</p>
          </div>
        </motion.div>
      )}

      {/* Details grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div><p className="text-xs text-muted-foreground mb-1">Description</p><p className="text-sm font-medium">{expense.description}</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">Category</p><p className="text-sm font-medium">{expense.category}</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">Amount (Original)</p><CurrencyDisplay amount={expense.amount} currency={expense.currency} /></div>
          <div><p className="text-xs text-muted-foreground mb-1">Amount (Company Currency)</p><CurrencyDisplay amount={expense.amount_in_company_currency} currency="INR" /></div>
          <div><p className="text-xs text-muted-foreground mb-1">Date</p><p className="text-sm">{expense.date}</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">Paid By</p><p className="text-sm">{expense.paid_by}</p></div>
          <div className="sm:col-span-2"><p className="text-xs text-muted-foreground mb-1">Remarks</p><p className="text-sm">{expense.remarks || '—'}</p></div>
        </div>
      </motion.div>

      {/* Approval Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Approval Timeline</h3>
        <ApprovalTimeline steps={mockApprovalSteps} />
      </motion.div>
    </div>
  );
};

export default ExpenseDetail;
