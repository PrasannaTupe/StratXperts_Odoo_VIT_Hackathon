import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Users, Receipt, Clock, CheckCircle, Plus, ShieldCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import StatusBadge from '@/components/shared/StatusBadge';
import { mockExpenses } from '@/data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const categoryData = [
  { name: 'Travel', value: 86200, color: 'hsl(239, 84%, 67%)' },
  { name: 'Food & Dining', value: 3500, color: 'hsl(168, 76%, 42%)' },
  { name: 'Software', value: 21912, color: 'hsl(38, 92%, 50%)' },
  { name: 'Office Supplies', value: 450, color: 'hsl(350, 89%, 60%)' },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = 'ReimburseAI — Dashboard'; }, []);

  const stats = [
    { label: 'Total Employees', value: 5, icon: Users, prefix: '' },
    { label: 'Expenses This Month', value: 110062, icon: Receipt, prefix: '₹' },
    { label: 'Pending Approvals', value: 2, icon: Clock, prefix: '' },
    { label: 'Approved This Month', value: 2, icon: CheckCircle, prefix: '' },
  ];

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <PageHeader title="Dashboard" subtitle={`Welcome back, ${user?.name}`} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold font-display">
              <AnimatedCounter value={s.value} prefix={s.prefix} />
            </p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Two column */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {mockExpenses.slice(0, 5).map(exp => (
              <div key={exp.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{exp.description}</p>
                  <p className="text-xs text-muted-foreground">{exp.employee_name} · {exp.date}</p>
                </div>
                <StatusBadge status={exp.status} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Donut chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`} contentStyle={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 20% 18%)', borderRadius: '8px', color: 'hsl(210 40% 96%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {categoryData.map(c => (
              <span key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                {c.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:scale-[1.03]">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
        <button onClick={() => navigate('/admin/rules/new')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-all hover:scale-[1.03]">
          <ShieldCheck className="w-4 h-4" /> Create Approval Rule
        </button>
        <button onClick={() => navigate('/admin/expenses')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-all hover:scale-[1.03]">
          <FileText className="w-4 h-4" /> View All Expenses
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
