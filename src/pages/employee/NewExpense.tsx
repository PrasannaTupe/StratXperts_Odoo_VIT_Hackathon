import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Sparkles, FileText, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Travel', 'Food & Dining', 'Office Supplies', 'Accommodation', 
  'Entertainment', 'Healthcare', 'Fuel', 'Communication', 'Miscellaneous'
];
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD', 'AED'];

// --- Helper Functions for OCR ---
const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || "YOUR_API_KEY";

const fileToBase64 = (f: File): Promise<string> => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res((r.result as string).split(',')[1]);
  r.onerror = rej;
  r.readAsDataURL(f);
});

async function parseReceiptWithGemini(base64Image: string, mimeType: string) {
  const prompt = `You are an expert receipt parser. Analyze this receipt image or document carefully.
Return ONLY a valid JSON object — no markdown, no backticks, no explanation.
{
  "description": "brief English description or merchant name",
  "category": "one of: Travel, Food & Dining, Office Supplies, Accommodation, Entertainment, Healthcare, Fuel, Communication, Miscellaneous",
  "date": "YYYY-MM-DD",
  "amount": numeric total paid,
  "currency_code": "3-letter ISO e.g. INR USD EUR JPY GBP",
  "notes": "any helpful note or null"
}
Translate ALL text to English. Return ONLY the JSON.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [
          { inline_data: { mime_type: mimeType, data: base64Image } },
          { text: prompt }
        ]}],
        generationConfig: { temperature: 0.1 }
      })
    }
  );
  if (!res.ok) throw new Error("Failed to scan receipt with AI");
  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return JSON.parse(raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
}
// ---------------------------------------

const NewExpense = () => {
  const { id } = useParams(); // TEAM'S CODE
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    description: '', category: 'Travel', paid_by: 'Amit Kumar', remarks: '',
    date: new Date().toISOString().split('T')[0], currency: 'USD', company_currency: 'INR', amount: '',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => { document.title = 'ReimburseAI — New Expense'; }, []);

  // TEAM'S CODE: Load existing data if editing
  useEffect(() => {
    if (id) {
      const localData = localStorage.getItem('my_expenses');
      if (localData) {
        const found = JSON.parse(localData).find((e: any) => e.id === Number(id));
        if (found) {
          // Ensure company_currency exists in older records
          setForm({ ...found, company_currency: found.company_currency || 'INR' });
        }
      }
    }
  }, [id]);

  // OUR CODE: Real Live Currency Auto-Conversion
  useEffect(() => {
    const numericAmount = parseFloat(form.amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      if (form.currency !== form.company_currency) {
        const fetchConversion = async () => {
          setIsConverting(true);
          try {
            const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${form.currency}`);
            const data = await res.json();
            const rate = data.rates[form.company_currency]; 
            if (rate) setConvertedAmount(numericAmount * rate);
            else setConvertedAmount(null);
          } catch (error) {
            console.error("Currency API Error:", error);
            setConvertedAmount(null);
          } finally {
            setIsConverting(false);
          }
        };
        const timer = setTimeout(fetchConversion, 600);
        return () => clearTimeout(timer);
      } else {
        setConvertedAmount(numericAmount);
        setIsConverting(false);
      }
    } else {
      setConvertedAmount(null);
      setIsConverting(false);
    }
  }, [form.amount, form.currency, form.company_currency]);

  // OUR CODE: Real Gemini OCR
  const handleScan = async () => {
    if (!file) { toast.error('Upload a receipt first'); return; }
    setScanning(true);
    
    try {
      const base64Data = await fileToBase64(file);
      let mimeType = file.type;
      if (!mimeType) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        const mimeMap: Record<string, string> = {
          'pdf': 'application/pdf', 'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
          'webp': 'image/webp', 'heic': 'image/heic'
        };
        mimeType = mimeMap[ext || ''] || 'image/jpeg';
      }
      
      const parsedData = await parseReceiptWithGemini(base64Data, mimeType);
      
      const aiCat = (parsedData.category || '').trim().toLowerCase();
      const matchedCategory = CATEGORIES.find(c => c.toLowerCase() === aiCat) || parsedData.category || 'Miscellaneous';
      const matchedCurrency = CURRENCIES.includes(parsedData.currency_code) ? parsedData.currency_code : 'USD';

      setForm(prev => ({
        ...prev,
        description: parsedData.description || prev.description,
        category: matchedCategory,
        amount: parsedData.amount ? String(parsedData.amount) : prev.amount,
        currency: matchedCurrency,
        date: parsedData.date || prev.date,
        remarks: parsedData.notes || prev.remarks
      }));
      
      setScanned(true);
      toast.success('Receipt scanned successfully!');
    } catch (error) {
      toast.error('AI scan failed. Please enter manually.');
    } finally {
      setScanning(false);
    }
  };

  // TEAM'S CODE: Save to LocalStorage
  const handleSubmit = (asDraft = false) => {
    if (!form.description || !form.amount) { toast.error('Fill required fields'); return; }

    const newExpense = {
      ...form,
      id: id ? Number(id) : Date.now(), 
      status: asDraft ? 'draft' : 'pending',
      amount_in_company_currency: convertedAmount || Number(form.amount),
      is_anomaly: false
    };

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

  return (
    <div className="pb-20 lg:pb-0 max-w-5xl mx-auto">
      <PageHeader title={id ? "Edit Expense" : "Submit New Expense"} subtitle="Upload receipt and fill expense details" />

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
          <h3 className="font-semibold">Receipt Upload & OCR</h3>
          <label className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
            <input type="file" accept="image/*, application/pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
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
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
          <h3 className="font-semibold">Expense Details</h3>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description *</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What was this expense for?" className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category *</label>
            <input list="category-options" value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border" />
            <datalist id="category-options">{CATEGORIES.map(c => <option key={c} value={c} />)}</datalist>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Paid By</label>
              <input value={form.paid_by} onChange={e => setForm({ ...form, paid_by: e.target.value })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Receipt Currency</label>
              <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Receipt Amount *</label>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Target Currency</label>
            <select value={form.company_currency} onChange={e => setForm({ ...form, company_currency: e.target.value })} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border">
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {form.currency !== form.company_currency && (
            <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total in {form.company_currency}</p>
                {isConverting ? <p className="text-sm italic animate-pulse">Calculating...</p> : convertedAmount ? <p className="font-semibold text-lg">{convertedAmount.toLocaleString('en-US', { style: 'currency', currency: form.company_currency })}</p> : <p className="text-sm italic">Requires calculation</p>}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Remarks</label>
            <textarea value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} rows={2} className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSubmit(false)} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">Submit</button>
            <button onClick={() => handleSubmit(true)} className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Save Draft</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewExpense;