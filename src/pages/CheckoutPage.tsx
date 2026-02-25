import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { orderAPI } from "@/services/api";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
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
      await orderAPI.create({
        items: items.map((i) => ({ menuItem: i._id, quantity: i.quantity })),
        deliveryDetails: form,
      });
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Checkout</h1>

      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <h2 className="mb-2 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wide">Order Summary</h2>
        {items.map((i) => (
          <div key={i._id} className="flex justify-between text-sm py-1">
            <span className="text-foreground">{i.name} × {i.quantity}</span>
            <span className="text-foreground font-medium">${(i.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-2 border-t border-border pt-2 flex justify-between font-semibold text-foreground">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Delivery Details</h2>
        {[
          { label: "Name", field: "name", placeholder: "John Doe", type: "text" },
          { label: "Address", field: "address", placeholder: "123 Main St, City", type: "text" },
          { label: "Phone", field: "phone", placeholder: "+1 234 567 890", type: "tel" },
        ].map(({ label, field, placeholder, type }) => (
          <div key={field}>
            <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
            <input
              type={type}
              value={(form as any)[field]}
              onChange={(e) => update(field, e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={placeholder}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
