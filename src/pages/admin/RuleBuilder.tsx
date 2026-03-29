import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GripVertical, X, Plus, Info } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import toast from 'react-hot-toast';

interface Approver {
  id: number;
  name: string;
  required: boolean;
}

const RuleBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: isEdit ? 'Standard Expense Approval' : '',
    description: isEdit ? 'For expenses under 10,000 INR' : '',
    min_amount: isEdit ? 0 : 0,
    max_amount: isEdit ? 10000 : 0,
    manager: 'Priya Patel',
    sequential: true,
    min_percentage: isEdit ? 0 : 0,
  });

  const [approvers, setApprovers] = useState<Approver[]>(
    isEdit ? [{ id: 1, name: 'Priya Patel', required: true }, { id: 2, name: 'Finance Team', required: true }] : []
  );

  useEffect(() => { document.title = `ReimburseAI — ${isEdit ? 'Edit' : 'Create'} Rule`; }, [isEdit]);

  const addApprover = () => setApprovers(prev => [...prev, { id: Date.now(), name: '', required: true }]);
  const removeApprover = (aid: number) => setApprovers(prev => prev.filter(a => a.id !== aid));

  const handleSave = () => {
    if (!form.name) { toast.error('Rule name is required'); return; }
    if (approvers.length === 0) { toast.error('Add at least one approver'); return; }
    toast.success(`Rule ${isEdit ? 'updated' : 'created'} successfully`);
    navigate('/admin/rules');
  };

  const ruleType = form.sequential && form.min_percentage > 0 ? 'Hybrid' : form.sequential ? 'Sequential' : form.min_percentage > 0 ? 'Percentage' : 'None';

  return (
    <div className="pb-20 lg:pb-0 max-w-5xl mx-auto">
      <PageHeader title={isEdit ? 'Edit Approval Rule' : 'Create Approval Rule'} subtitle="Define how expenses get routed for approval" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left - Config */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
          <h3 className="font-semibold text-lg">Rule Configuration</h3>
          <div>
            <label className="block text-sm font-medium mb-1.5">Rule Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Standard Expense Approval" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border placeholder:text-muted-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border resize-none placeholder:text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Min Amount (₹)</label>
              <input type="number" value={form.min_amount} onChange={e => setForm({ ...form, min_amount: Number(e.target.value) })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Max Amount (₹)</label>
              <input type="number" value={form.max_amount} onChange={e => setForm({ ...form, max_amount: Number(e.target.value) })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Manager</label>
            <select value={form.manager} onChange={e => setForm({ ...form, manager: e.target.value })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border">
              <option>Priya Patel</option>
            </select>
            <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-status-in-review/10 border border-status-in-review/20">
              <Info className="w-4 h-4 text-status-in-review shrink-0 mt-0.5" />
              <p className="text-xs text-status-in-review">This manager will be the first to approve, before the approver sequence below</p>
            </div>
          </div>
        </motion.div>

        {/* Right - Approvers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Approvers</h3>
            <span className="text-xs text-muted-foreground">Required</span>
          </div>
          <div className="space-y-2">
            {approvers.map((a, i) => (
              <div key={a.id} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
                <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
                <input value={a.name} onChange={e => setApprovers(prev => prev.map(x => x.id === a.id ? { ...x, name: e.target.value } : x))} placeholder="Search user..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                <button onClick={() => setApprovers(prev => prev.map(x => x.id === a.id ? { ...x, required: !x.required } : x))} className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${a.required ? 'bg-status-approved/20 text-status-approved' : 'bg-muted text-muted-foreground'}`}>
                  ✓
                </button>
                <button onClick={() => removeApprover(a.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addApprover} className="flex items-center gap-2 text-sm text-primary hover:underline">
            <Plus className="w-4 h-4" /> Add Approver
          </button>
        </motion.div>
      </div>

      {/* Approval Logic */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 mt-6 space-y-4">
        <h3 className="font-semibold text-lg">Approval Logic</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.sequential} onChange={e => setForm({ ...form, sequential: e.target.checked })} className="rounded" />
          <div>
            <p className="text-sm font-medium">Approve in Sequence</p>
            <p className="text-xs text-muted-foreground">All approvers must approve in strict order</p>
          </div>
        </label>
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Minimum Approval Percentage</p>
            <span className="text-sm text-primary font-semibold">{form.min_percentage}%</span>
          </div>
          <input type="range" min={0} max={100} value={form.min_percentage} onChange={e => setForm({ ...form, min_percentage: Number(e.target.value) })} className="w-full accent-primary" />
          {form.min_percentage > 0 && (
            <p className="text-xs text-muted-foreground mt-1">Expense is auto-approved when {form.min_percentage}% of approvers have approved</p>
          )}
        </div>
        {form.sequential && form.min_percentage > 0 && (
          <div className="p-3 rounded-lg bg-status-pending/10 border border-status-pending/20">
            <p className="text-xs text-status-pending">Hybrid mode: sequential flow runs first; percentage threshold can trigger early approval</p>
          </div>
        )}
        <p className="text-xs text-muted-foreground">Current mode: <span className="text-foreground font-medium">{ruleType}</span></p>
      </motion.div>

      <button onClick={handleSave} className="w-full mt-6 bg-primary text-primary-foreground rounded-lg py-3 text-sm font-medium hover:bg-primary/90 transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/25">
        {isEdit ? 'Update Rule' : 'Save Rule'}
      </button>
    </div>
  );
};

export default RuleBuilder;
