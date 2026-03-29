import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Send } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { mockTeamMembers } from '@/data/mockData';
import { TeamMember } from '@/data/types';
import toast from 'react-hot-toast';

const roleBadgeColors: Record<string, string> = {
  admin: 'bg-primary/20 text-primary',
  manager: 'bg-status-in-review/20 text-status-in-review',
  employee: 'bg-muted text-muted-foreground',
};

const AdminUsers = () => {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'employee' as 'employee' | 'manager', manager: '' });

  useEffect(() => { document.title = 'ReimburseAI — Team Members'; }, []);

  const managers = members.filter(m => m.role === 'manager');

  const handleAdd = () => {
    if (!newUser.name || !newUser.email) { toast.error('Fill all fields'); return; }
    const m: TeamMember = { id: Date.now(), ...newUser, status: 'active', manager: newUser.role === 'employee' ? newUser.manager : null };
    setMembers(prev => [...prev, m]);
    setShowAdd(false);
    setNewUser({ name: '', email: '', role: 'employee', manager: '' });
    toast.success('Member added');
  };

  const handleDelete = () => {
    setMembers(prev => prev.filter(m => m.id !== deleteId));
    setDeleteId(null);
    toast.success('Member removed');
  };

  return (
    <div className="pb-20 lg:pb-0">
      <PageHeader title="Team Members" subtitle="Manage your organization's team" action={
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:scale-[1.03]">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      } />

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-muted-foreground font-medium">Name</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Role</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Manager</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
                  <td className="p-4 font-medium">{m.name}</td>
                  <td className="p-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadgeColors[m.role]}`}>{m.role}</span></td>
                  <td className="p-4 text-muted-foreground">{m.manager || '—'}</td>
                  <td className="p-4 text-muted-foreground">{m.email}</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs bg-status-approved/20 text-status-approved capitalize">{m.status}</span></td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toast.success('Temporary password sent')} className="p-1.5 rounded hover:bg-muted transition-colors" title="Send password">
                        <Send className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                      <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded hover:bg-muted transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {members.map(m => (
            <div key={m.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadgeColors[m.role]}`}>{m.role}</span>
              </div>
              {m.manager && <p className="text-xs text-muted-foreground">Manager: {m.manager}</p>}
              <div className="flex gap-2">
                <button onClick={() => toast.success('Password sent')} className="text-xs text-primary">Send Password</button>
                <button onClick={() => setDeleteId(m.id)} className="text-xs text-destructive">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Modal */}
      <ConfirmModal open={showAdd} title="Add Team Member" confirmLabel="Add Member" onConfirm={handleAdd} onCancel={() => setShowAdd(false)}>
        <div className="space-y-3 mt-4">
          <input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Name" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border placeholder:text-muted-foreground" />
          <input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border placeholder:text-muted-foreground" />
          <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value as 'employee' | 'manager' })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border">
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
          {newUser.role === 'employee' && (
            <select value={newUser.manager} onChange={e => setNewUser({ ...newUser, manager: e.target.value })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border">
              <option value="">Select Manager</option>
              {managers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          )}
        </div>
      </ConfirmModal>

      {/* Delete Confirm */}
      <ConfirmModal open={deleteId !== null} title="Remove Member" description="Are you sure? This action cannot be undone." confirmLabel="Remove" confirmVariant="destructive" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
};

export default AdminUsers;
