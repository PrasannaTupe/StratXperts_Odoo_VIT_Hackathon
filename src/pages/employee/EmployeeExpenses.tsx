import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Eye, Pencil, Search } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import AnomalyBadge from '@/components/shared/AnomalyBadge';
import CurrencyDisplay from '@/components/shared/CurrencyDisplay';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { mockExpenses } from '@/data/mockData';
import { ExpenseStatus } from '@/data/types';

const stages = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'pending', label: 'Waiting Approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
] as const;

const EmployeeExpenses = () => {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => { document.title = 'ReimburseAI — My Expenses'; }, []);

  const filtered = mockExpenses.filter(e => {
    if (activeStage !== 'all' && e.status !== activeStage) return false;
    if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalAmount = mockExpenses.reduce((a, e) => a + e.amount_in_company_currency, 0);
  const pending = mockExpenses.filter(e => e.status === 'pending').length;
  const approved = mockExpenses.filter(e => e.status === 'approved').length;
  const rejected = mockExpenses.filter(e => e.status === 'rejected').length;

  return (
    <div className="pb-20 lg:pb-0 space-y-6">
      <PageHeader title="My Expenses" subtitle="Track and manage your expense submissions" action={
        <button onClick={() => navigate('/employee/expenses/new')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:scale-[1.03]">
          <Plus className="w-4 h-4" /> Submit New Expense
        </button>
      } />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Total Submitted</p>
          <p className="text-xl font-bold font-display"><AnimatedCounter value={mockExpenses.length} /></p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Total Amount</p>
          <p className="text-xl font-bold font-display"><AnimatedCounter value={totalAmount} prefix="₹" /></p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-xl font-bold font-display text-status-pending"><AnimatedCounter value={pending} /></p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Approved / Rejected</p>
          <p className="text-xl font-bold font-display"><span className="text-status-approved"><AnimatedCounter value={approved} /></span> / <span className="text-status-rejected"><AnimatedCounter value={rejected} /></span></p>
        </div>
      </div>

      {/* Pipeline */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {stages.map(s => (
          <button key={s.key} onClick={() => setActiveStage(s.key)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeStage === s.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by description..." className="w-full bg-muted rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border placeholder:text-muted-foreground" />
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Date', 'Description', 'Category', 'Amount', 'Company Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(exp => (
                <tr key={exp.id} className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${exp.is_anomaly ? 'border-l-2 border-l-status-pending' : ''}`}>
                  <td className="p-4 text-muted-foreground">{exp.date}</td>
                  <td className="p-4 font-medium">{exp.description}</td>
                  <td className="p-4 text-muted-foreground">{exp.category}</td>
                  <td className="p-4"><CurrencyDisplay amount={exp.amount} currency={exp.currency} /></td>
                  <td className="p-4"><CurrencyDisplay amount={exp.amount_in_company_currency} currency="INR" /></td>
                  <td className="p-4">
                    <StatusBadge status={exp.status} />
                    {exp.is_anomaly && <div className="mt-1"><AnomalyBadge /></div>}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/employee/expenses/${exp.id}`)} className="p-1.5 rounded hover:bg-muted transition-colors"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                      {exp.status === 'draft' && <button className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil className="w-4 h-4 text-muted-foreground" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile */}
        <div className="md:hidden divide-y divide-border">
          {filtered.map(exp => (
            <div key={exp.id} onClick={() => navigate(`/employee/expenses/${exp.id}`)} className={`p-4 space-y-2 cursor-pointer hover:bg-muted/30 ${exp.is_anomaly ? 'border-l-2 border-l-status-pending' : ''}`}>
              <div className="flex justify-between items-start">
                <div><p className="font-medium text-sm">{exp.description}</p><p className="text-xs text-muted-foreground">{exp.date} · {exp.category}</p></div>
                <StatusBadge status={exp.status} />
              </div>
              <CurrencyDisplay amount={exp.amount} currency={exp.currency} showConverted convertedAmount={exp.amount_in_company_currency} />
              {exp.is_anomaly && <AnomalyBadge />}
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-3">No expenses found</p>
            <button onClick={() => navigate('/employee/expenses/new')} className="text-sm text-primary hover:underline">Submit your first expense →</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EmployeeExpenses;
