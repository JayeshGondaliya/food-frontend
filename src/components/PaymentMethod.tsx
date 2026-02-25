import { CreditCard, Smartphone, Wallet } from "lucide-react";

interface PaymentMethodProps {
  value: string;
  onChange: (method: string) => void;
}

const paymentOptions = [
  { value: "paytm", label: "Paytm", icon: CreditCard },
  { value: "gpay", label: "Google Pay", icon: Smartphone },
  { value: "phonepe", label: "PhonePe", icon: Smartphone },
  { value: "cash", label: "Cash on Delivery", icon: Wallet }
];

const PaymentMethod = ({ value, onChange }: PaymentMethodProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        Payment Method
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {paymentOptions.map(({ value: val, label, icon: Icon }) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-3 text-xs font-medium transition-all sm:text-sm ${
              value === val
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;