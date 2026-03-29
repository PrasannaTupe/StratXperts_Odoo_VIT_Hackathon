import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      // Role-based redirect handled by checking user after login
      const stored = localStorage.getItem('reimburse_user');
      if (stored) {
        const user = JSON.parse(stored);
        const redirectMap: Record<string, string> = { admin: '/admin/dashboard', manager: '/manager/approvals', employee: '/employee/expenses' };
        navigate(redirectMap[user.role] || '/');
      }
    } catch { toast.error('Login failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      <div className="gradient-mesh" />

      {/* Left branding - hidden on mobile */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="font-display text-5xl font-bold mb-4">Reimburse<span className="text-primary">AI</span></h1>
          <p className="text-xl text-muted-foreground max-w-md">AI-powered expense management. Submit, track, and approve expenses with intelligent automation.</p>
          <div className="mt-12 space-y-4">
            {['AI-powered receipt scanning', 'Multi-currency support', 'Smart approval workflows'].map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="glass-card p-8">
            <h2 className="font-display text-2xl font-bold mb-1 lg:hidden">Reimburse<span className="text-primary">AI</span></h2>
            <h3 className="text-xl font-semibold mb-1">Welcome back</h3>
            <p className="text-sm text-muted-foreground mb-6">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border pr-10 placeholder:text-muted-foreground" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-border" /> Remember me
                </label>
                <button type="button" onClick={() => toast('Contact your administrator')} className="text-sm text-primary hover:underline">Forgot password?</button>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">Demo accounts: <span className="text-foreground">admin@acme.com</span>, <span className="text-foreground">manager@acme.com</span>, <span className="text-foreground">employee@acme.com</span></p>
              <p className="text-sm text-muted-foreground mt-1">(any password works)</p>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
