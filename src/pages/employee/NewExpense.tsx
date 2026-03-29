import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Sparkles, FileText } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { EXPENSE_CATEGORIES } from '@/data/types';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const NewExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Update Initial State to check for existing data if 'id' exists
  useEffect(() => {
    if (id) {
      const localData = localStorage.getItem('my_expenses');
      if (localData) {
        const found = JSON.parse(localData).find((e: any) => e.id === Number(id));
        if (found) setForm(found);
      }
    }
  }, [id]);

  const handleSubmit = (asDraft = false) => {
    if (!form.description || !form.amount) { toast.error('Fill required fields'); return; }

    const newExpense = {
      ...form,
      id: id ? Number(id) : Date.now(), // Use existing ID or create new
      status: asDraft ? 'draft' : 'pending',
      amount_in_company_currency: convertedAmount || Number(form.amount),
      is_anomaly: false
    };

    // Save to LocalStorage
    const existing = JSON.parse(localStorage.getItem('my_expenses') || '[]');
    let updated;
    if (id) {
        updated = existing.map((e: any) => e.id === Number(id) ? newExpense : e);
    } else {
        updated = [...existing, newExpense];
    }
    
    localStorage.setItem('my_expenses', JSON.stringify(updated));

    toast.success(asDraft ? 'Saved as draft' : 'Expense submitted for approval');
    navigate('/employee/expenses');
  };

  
  const [form, setForm] = useState({
    description: '', category: 'Travel', paid_by: 'Amit Kumar', remarks: '',
    date: new Date().toISOString().split('T')[0], currency: 'INR', amount: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => { document.title = 'ReimburseAI — New Expense'; }, []);

  // Mock currency conversion
  useEffect(() => {
    if (form.amount && form.currency !== 'INR') {
      const timer = setTimeout(() => {
        const rates: Record<string, number> = { USD: 83, EUR: 90, GBP: 105 };
        const rate = rates[form.currency] || 1;
        setConvertedAmount(Number(form.amount) * rate);
      }, 500);
      return () => clearTimeout(timer);
    } else if (form.currency === 'INR') {
      setConvertedAmount(Number(form.amount) || null);
    }
  }, [form.amount, form.currency]);

  const handleScan = () => {
    if (!file) { toast.error('Upload a receipt first'); return; }
    setScanning(true);
    setTimeout(() => {
      setForm({ ...form, description: 'Team lunch at Taj Restaurant', category: 'Food & Dining', amount: '3500', currency: 'INR', date: '2025-06-10' });
      setScanning(false);
      setScanned(true);
      toast.success('Fields auto-filled! Please verify.');
    }, 2000);
  };

  // const handleSubmit = (asDraft = false) => {
  //   if (!form.description || !form.amount) { toast.error('Fill required fields'); return; }
  //   toast.success(asDraft ? 'Saved as draft' : 'Expense submitted for approval');
  //   navigate('/employee/expenses');
  // };

  return (
    <div className="pb-20 lg:pb-0 max-w-5xl mx-auto">
      <PageHeader title="Submit New Expense" subtitle="Upload receipt and fill expense details" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left - Upload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
          <h3 className="font-semibold">Receipt Upload & OCR</h3>
          <label className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
            <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
            {file ? (
              <div className="space-y-2">
                <FileText className="w-10 h-10 mx-auto text-primary" />
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drop your receipt here or click to upload</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, PDF</p>
              </div>
            )}
          </label>

          {scanning && (
            <div className="relative rounded-lg bg-muted h-2 overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-secondary rounded-full animate-[slide-in-right_1s_ease-in-out_infinite]" />
            </div>
          )}

          <button onClick={handleScan} disabled={scanning} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 transition-all disabled:opacity-50">
            <Sparkles className="w-4 h-4" /> {scanning ? 'Scanning receipt...' : 'Scan with AI'}
          </button>
          {scanned && <p className="text-xs text-status-approved">✓ Fields auto-filled! Please verify.</p>}
          <p className="text-xs text-muted-foreground">AI may make errors. Please verify all fields.</p>
        </motion.div>

        {/* Right - Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
          <h3 className="font-semibold">Expense Details</h3>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description *</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What was this expense for?" className={`w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 border placeholder:text-muted-foreground ${scanning ? 'skeleton-shimmer' : 'bg-muted border-border'}`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category *</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border">
              {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Paid By</label>
            <input value={form.paid_by} onChange={e => setForm({ ...form, paid_by: e.target.value })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Remarks</label>
            <textarea value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} rows={2} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border resize-none placeholder:text-muted-foreground" placeholder="Optional notes..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Date *</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Currency</label>
              <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border">
                {['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Amount *</label>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border placeholder:text-muted-foreground" />
            </div>
          </div>
          {convertedAmount && form.currency !== 'INR' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
              ≈ ₹{convertedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} in company currency
            </motion.p>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSubmit(false)} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-all hover:scale-[1.02]">
              Submit for Approval
            </button>
            <button onClick={() => handleSubmit(true)} className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
              Save Draft
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewExpense;
