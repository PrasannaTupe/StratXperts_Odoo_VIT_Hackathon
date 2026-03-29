import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { mockRules } from '@/data/mockData';

const typeBadge: Record<string, string> = {
  sequential: 'bg-primary/20 text-primary',
  percentage: 'bg-secondary/20 text-secondary',
  hybrid: 'bg-status-pending/20 text-status-pending',
};

const AdminRules = () => {
  const navigate = useNavigate();
  useEffect(() => { document.title = 'ReimburseAI — Approval Rules'; }, []);

  return (
    <div className="pb-20 lg:pb-0">
      <PageHeader title="Approval Rules" subtitle="Configure how expenses get approved" action={
        <button onClick={() => navigate('/admin/rules/new')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:scale-[1.03]">
          <Plus className="w-4 h-4" /> Create New Rule
        </button>
      } />

      <div className="grid sm:grid-cols-2 gap-4">
        {mockRules.map((rule, i) => (
          <motion.div key={rule.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold">{rule.name}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${typeBadge[rule.type]}`}>{rule.type}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{rule.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span>{rule.approver_count} approvers</span>
              <span>₹{rule.min_amount.toLocaleString()} — ₹{rule.max_amount.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/admin/rules/${rule.id}/edit`)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-colors">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminRules;
