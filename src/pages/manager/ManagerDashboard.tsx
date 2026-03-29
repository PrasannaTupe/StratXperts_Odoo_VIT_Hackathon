import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import StatusBadge from '@/components/shared/StatusBadge';
import { mockExpenses } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const chartData = [
  { name: 'Amit', amount: 98460 },
  { name: 'Neha', amount: 450 },
  { name: 'Vikram', amount: 1200 },
];

const ManagerDashboard = () => {
  const { user } = useAuth();
  useEffect(() => { document.title = 'ReimburseAI — Manager Dashboard'; }, []);

  const stats = [
    { label: 'Pending Approvals', value: 2, icon: Clock, color: 'text-status-pending' },
    { label: 'Approved This Month', value: 2, icon: CheckCircle, color: 'text-status-approved' },
    { label: 'Rejected This Month', value: 1, icon: XCircle, color: 'text-status-rejected' },
    { label: 'Total Team Spend', value: 110062, icon: DollarSign, prefix: '₹', color: 'text-primary' },
  ];

  return (
    <div className="pb-20 lg:pb-0 space-y-8">
      <PageHeader title="Manager Dashboard" subtitle={`Hello, ${user?.name}`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-5">
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <p className="text-2xl font-bold font-display">
              <AnimatedCounter value={s.value} prefix={s.prefix || ''} />
            </p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Team Expenses by Employee</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 20% 18%)', borderRadius: '8px', color: 'hsl(210 40% 96%)' }} formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`} />
              <Bar dataKey="amount" fill="hsl(239, 84%, 67%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {mockExpenses.slice(0, 5).map(exp => (
            <div key={exp.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{exp.description}</p>
                <p className="text-xs text-muted-foreground">{exp.employee_name} · {exp.date}</p>
              </div>
              <StatusBadge status={exp.status} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ManagerDashboard;
