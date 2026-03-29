import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import AnomalyBadge from '@/components/shared/AnomalyBadge';
import CurrencyDisplay from '@/components/shared/CurrencyDisplay';
import { mockExpenses } from '@/data/mockData';
import { ExpenseStatus } from '@/data/types';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/shared/ConfirmModal';

const AdminExpenses = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | 'all'>('all');
  const [overrideId, setOverrideId] = useState<number | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<ExpenseStatus>('approved');

  useEffect(() => { document.title = 'ReimburseAI — All Expenses'; }, []);

  const filtered = mockExpenses.filter(e => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="pb-20 lg:pb-0">
      <PageHeader title="All Expenses" subtitle="View and manage all company expenses" />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses..." className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border placeholder:text-muted-foreground" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as ExpenseStatus | 'all')} className="bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border">
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Date', 'Employee', 'Description', 'Category', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(exp => (
                <tr key={exp.id} className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${exp.is_anomaly ? 'border-l-2 border-l-status-pending' : ''}`}>
                  <td className="p-4 text-muted-foreground">{exp.date}</td>
                  <td className="p-4">{exp.employee_name}</td>
                  <td className="p-4 font-medium">{exp.description}</td>
                  <td className="p-4 text-muted-foreground">{exp.category}</td>
                  <td className="p-4">
                    <CurrencyDisplay amount={exp.amount} currency={exp.currency} showConverted convertedAmount={exp.amount_in_company_currency} />
                    {exp.is_anomaly && <div className="mt-1"><AnomalyBadge /></div>}
                  </td>
                  <td className="p-4"><StatusBadge status={exp.status} /></td>
                  <td className="p-4">
                    <button onClick={() => setOverrideId(exp.id)} className="text-xs text-primary hover:underline">Override</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile */}
        <div className="md:hidden divide-y divide-border">
          {filtered.map(exp => (
            <div key={exp.id} className={`p-4 space-y-2 ${exp.is_anomaly ? 'border-l-2 border-l-status-pending' : ''}`}>
              <div className="flex justify-between"><span className="font-medium text-sm">{exp.description}</span><StatusBadge status={exp.status} /></div>
              <p className="text-xs text-muted-foreground">{exp.employee_name} · {exp.date} · {exp.category}</p>
              <CurrencyDisplay amount={exp.amount} currency={exp.currency} showConverted convertedAmount={exp.amount_in_company_currency} />
              {exp.is_anomaly && <AnomalyBadge />}
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground">No expenses found</div>}
      </motion.div>

      <ConfirmModal open={overrideId !== null} title="Override Status" confirmLabel="Override" onConfirm={() => { toast.success('Status overridden'); setOverrideId(null); }} onCancel={() => setOverrideId(null)}>
        <div className="mt-4">
          <select value={overrideStatus} onChange={e => setOverrideStatus(e.target.value as ExpenseStatus)} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border">
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
          <textarea placeholder="Reason for override..." className="w-full mt-3 bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border resize-none" rows={2} />
        </div>
      </ConfirmModal>
    </div>
  );
};

export default AdminExpenses;
