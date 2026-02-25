import { useEffect, useState, useCallback } from "react";
import { orderAPI } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";
import StatusBadge from "@/components/StatusBadge";
import OrderStepper from "@/components/OrderStepper";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Package, Printer } from "lucide-react";
import toast from "react-hot-toast";
import { generateOrderPDF } from "@/utils/generatePDF";

// GST rate (same as invoice)
const GST_RATE = 0.05;

interface OrderItem {
  menuItemId: {
    _id: string;
    name: string;
    price: number;
  } | null;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  customerName: string;
  address: string;
  phone: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI
      .getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = useCallback(
    (data: { orderId: string; status: string }) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === data.orderId ? { ...o, status: data.status } : o))
      );
      toast.success(`Order status updated: ${data.status}`);
    },
    []
  );

  useSocket("order_status_updated", handleStatusUpdate);

  const handlePrintBill = (order: Order) => {
    try {
      generateOrderPDF(order);
      toast.success("PDF generated successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Place your first order from the menu!"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const subtotal = order.items.reduce(
              (sum, item) => sum + (item.menuItemId?.price || 0) * item.quantity,
              0
            );
            const gst = subtotal * GST_RATE;
            const grandTotal = subtotal + gst;

            return (
              <div
                key={order._id}
                className="rounded-lg border border-border bg-card p-5 animate-fade-in"
              >
                {/* Header with order number and actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} />
                    <button
                      onClick={() => handlePrintBill(order)}
                      className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="Print Bill"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Order Stepper */}
                <OrderStepper status={order.status} />

                {/* Items list */}
                <div className="mt-4 space-y-1 text-sm">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between text-foreground">
                      <span>
                        {item.menuItemId?.name || "Unknown Item"} × {item.quantity}
                      </span>
                      <span>
                        ${((item.menuItemId?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* GST Summary */}
                <div className="mt-3 border-t border-border pt-2 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>GST (5%)</span>
                    <span>${gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground text-sm pt-1 border-t border-border">
                    <span>Grand Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery & Payment Info */}
                <div className="mt-2 text-xs text-muted-foreground">
                  📍 {order.address} • 📞 {order.phone} • 💳{" "}
                  {order.paymentMethod === "cash"
                    ? "Cash on Delivery"
                    : order.paymentMethod.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;