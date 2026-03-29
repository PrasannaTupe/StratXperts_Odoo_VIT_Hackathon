interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  showConverted?: boolean;
  convertedAmount?: number;
  companyCurrency?: string;
}

const currencySymbols: Record<string, string> = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$',
};

const formatAmount = (amount: number, currency: string) => {
  const symbol = currencySymbols[currency] || currency + ' ';
  return `${symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const CurrencyDisplay = ({ amount, currency, showConverted, convertedAmount, companyCurrency = 'INR' }: CurrencyDisplayProps) => (
  <div>
    <span className="font-medium">{formatAmount(amount, currency)}</span>
    {showConverted && convertedAmount && currency !== companyCurrency && (
      <span className="block text-xs text-muted-foreground">≈ {formatAmount(convertedAmount, companyCurrency)}</span>
    )}
  </div>
);

export { formatAmount, currencySymbols };
export default CurrencyDisplay;
