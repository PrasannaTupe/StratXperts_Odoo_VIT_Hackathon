import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'bot';
  content: string;
}

const suggestions = [
  'What are my pending expenses?',
  'How does the approval process work?',
  'Show my expense summary this month',
  "What's the status of my last submission?",
];

const botResponses: Record<string, string> = {
  'What are my pending expenses?': 'You have 2 pending expenses: AWS subscription ($120) and International conference (₹85,000). Both are awaiting approval.',
  'How does the approval process work?': 'When you submit an expense, it follows your company\'s approval rules. Each approver reviews in sequence. You can track progress on the expense detail page.',
  'Show my expense summary this month': 'This month you\'ve submitted 6 expenses totaling ₹1,10,062. 2 approved, 2 pending, 1 rejected, 1 draft.',
  "What's the status of my last submission?": 'Your last submission "Figma Pro annual" ($144) is currently in Draft status. Submit it to start the approval process.',
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = botResponses[text] || "I understand your question. Let me look into that for you. In the meantime, you can check your expenses dashboard for the latest information.";
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', content: response }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* FAB */}
      <button onClick={() => setOpen(!open)} className="fixed bottom-20 lg:bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-36 lg:bottom-24 right-6 z-50 w-[340px] sm:w-[380px] h-[440px] glass-card flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">ReimburseAI Assistant</p>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center mb-3">Try a quick question:</p>
                  {suggestions.map(s => (
                    <button key={s} onClick={() => sendMessage(s)} className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-muted px-4 py-2 rounded-xl rounded-bl-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me anything..." className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" />
                <button type="submit" className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
