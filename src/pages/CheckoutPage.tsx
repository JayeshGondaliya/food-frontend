import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { orderAPI } from "@/services/api";
import PaymentMethod from "@/components/PaymentMethod";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  address: string;
  phone: string;
  paymentMethod: string; // now can be 'paytm' | 'gpay' | 'phonepe' | 'cash'
}

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cash"
  });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return false; }
    if (!form.address.trim()) { toast.error("Address is required"); return false; }
    if (!form.phone.trim()) { toast.error("Phone is required"); return false; }
    if (items.length === 0) { toast.error("Cart is empty"); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const orderData = {
        items: items.map((item) => ({ menuItem: item._id, quantity: item.quantity })),
        deliveryDetails: {
          name: form.name,
          address: form.address,
          phone: form.phone
        },
        paymentMethod: form.paymentMethod
      };

      await orderAPI.create(orderData);
      clearCart();

      if (form.paymentMethod !== "cash") {
        // Simulate UPI payment redirection
        toast.success(`Redirecting to ${form.paymentMethod}...`);
        setTimeout(() => {
          toast.success("Payment successful! Order placed.");
          navigate("/orders");
        }, 2000);
      } else {
        toast.success("Order placed successfully! (Cash on delivery)");
        navigate("/orders");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Checkout</h1>

      {/* Order Summary */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <h2 className="mb-2 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Order Summary
        </h2>
        {items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm py-1">
            <span className="text-foreground">{item.name} × {item.quantity}</span>
            <span className="text-foreground font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-2 border-t border-border pt-2 flex justify-between font-semibold text-foreground">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery & Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Delivery Details</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="John Doe"
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="123 Main St, City"
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="+1 234 567 890"
            disabled={loading}
          />
        </div>

        {/* Payment Method Selection */}
        <PaymentMethod value={form.paymentMethod} onChange={(val) => updateField("paymentMethod", val)} />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;