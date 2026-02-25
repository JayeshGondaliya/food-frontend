import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import EmptyState from "@/components/EmptyState";

const CartPage = () => {
  const { items, increaseQty, decreaseQty, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the menu and add some delicious items!"
          action={
            <Link to="/menu" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Browse Menu
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 animate-fade-in">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">🍽️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                <p className="text-sm text-primary font-semibold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => decreaseQty(item._id)} className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                <button onClick={() => increaseQty(item._id)} className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <p className="w-16 text-right text-sm font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeItem(item._id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-6 h-fit">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground text-base">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-4 block w-full rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
