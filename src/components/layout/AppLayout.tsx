import { useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Receipt, Users, ShieldCheck, LogOut,
  Menu, X, Bell, ChevronRight, Settings
} from 'lucide-react';
import NotificationPanel from '@/components/shared/NotificationPanel';
import ChatWidget from '@/components/shared/ChatWidget';

const adminNav = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Team Members', path: '/admin/users', icon: Users },
  { label: 'Approval Rules', path: '/admin/rules', icon: ShieldCheck },
  { label: 'All Expenses', path: '/admin/expenses', icon: Receipt },
];
const managerNav = [
  { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
  { label: 'Approvals', path: '/manager/approvals', icon: ShieldCheck },
];
const employeeNav = [
  { label: 'My Expenses', path: '/employee/expenses', icon: Receipt },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  if (!user) return null;

  const navItems = user.role === 'admin' ? adminNav : user.role === 'manager' ? managerNav : employeeNav;
  const roleBadgeColor = user.role === 'admin' ? 'bg-primary/20 text-primary' : user.role === 'manager' ? 'bg-status-in-review/20 text-status-in-review' : 'bg-muted text-muted-foreground';

  const breadcrumb = location.pathname.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' '));

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="gradient-mesh" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-sidebar shrink-0">
        <div className="p-5 border-b border-border">
          <h2 className="font-display text-xl font-bold text-foreground">Reimburse<span className="text-primary">AI</span></h2>
          <p className="text-xs text-muted-foreground mt-1">{user.company_name} · {user.company_currency}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${active ? 'text-primary-foreground bg-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">{user.name.charAt(0)}</div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize ${roleBadgeColor}`}>{user.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }} className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-border z-50 lg:hidden flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="font-display text-xl font-bold">Reimburse<span className="text-primary">AI</span></h2>
                <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <nav className="flex-1 p-3 space-y-1">
                {navItems.map(item => {
                  const active = location.pathname.startsWith(item.path);
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'text-primary-foreground bg-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
                      <item.icon className="w-4 h-4" /> {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-border">
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-14 border-b border-border bg-card/40 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
              {breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3" />}
                  <span className={i === breadcrumb.length - 1 ? 'text-foreground font-medium' : ''}>{crumb}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm lg:hidden">{user.name.charAt(0)}</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-sidebar border-t border-border flex justify-around py-2 lg:hidden z-30">
        {navItems.map(item => {
          const active = location.pathname.startsWith(item.path);
          return (
            <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <ChatWidget />
    </div>
  );
};

export default AppLayout;
