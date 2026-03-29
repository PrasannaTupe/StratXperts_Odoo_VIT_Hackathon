import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Country {
  name: { common: string };
  currencies?: Record<string, { name: string; symbol: string }>;
}

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ company_name: '', name: '', email: '', password: '', confirmPassword: '' });
  const [country, setCountry] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [countries, setCountries] = useState<{ name: string; currency: string; symbol: string }[]>([]);
  const [search, setSearch] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,currencies')
      .then(r => r.json())
      .then((data: Country[]) => {
        const mapped = data.map(c => {
          const cur = c.currencies ? Object.entries(c.currencies)[0] : null;
          return { name: c.name.common, currency: cur ? cur[0] : '', symbol: cur ? cur[1].symbol : '' };
        }).filter(c => c.currency).sort((a, b) => a.name.localeCompare(b.name));
        setCountries(mapped);
      }).catch(() => {
        setCountries([{ name: 'India', currency: 'INR', symbol: '₹' }, { name: 'United States', currency: 'USD', symbol: '$' }]);
      });
  }, []);

  const filteredCountries = countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleCountrySelect = (c: typeof countries[0]) => {
    setCountry(c.name);
    setCurrency(c.currency);
    setCurrencySymbol(c.symbol);
    setSearch(c.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name || !form.name || !form.email || !form.password) { toast.error('Fill all fields'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (!currency) { toast.error('Select a country'); return; }
    setLoading(true);
    try {
      await signup({ ...form, country, currency });
      toast.success('Company created!');
      navigate('/admin/dashboard');
    } catch { toast.error('Signup failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <div className="gradient-mesh" />
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="glass-card p-8">
          <h1 className="font-display text-2xl font-bold mb-1">Reimburse<span className="text-primary">AI</span></h1>
          <p className="text-sm text-muted-foreground mb-6">Create your company account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Company Name</label>
              <input value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="Acme Corp" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Your Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border pr-10 placeholder:text-muted-foreground" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border placeholder:text-muted-foreground" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-1.5">Country</label>
              <input value={search} onChange={e => { setSearch(e.target.value); setCountry(''); }} placeholder="Search country..." className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border placeholder:text-muted-foreground" />
              {search && !country && filteredCountries.length > 0 && (
                <div className="absolute z-10 w-full mt-1 glass-card max-h-40 overflow-auto py-1">
                  {filteredCountries.slice(0, 10).map(c => (
                    <button key={c.name} type="button" onClick={() => handleCountrySelect(c)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
              {currency && (
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                  {country} → {currency} {currencySymbol}
                </span>
              )}
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Company & Get Started'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
