import { useEffect, useState, useCallback } from "react";
import { orderAPI } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";
import StatusBadge from "@/components/StatusBadge";
import OrderStepper from "@/components/OrderStepper";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Package } from "lucide-react";
import toast from "react-hot-toast";

interface OrderItem {
  menuItem: { name: string; price: number } | string;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  deliveryDetails?: { name: string; address: string; phone: string };
  createdAt: string;
}

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI
      .getMyOrders()
      .then((res) => setOrders(res.data.orders || res.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = useCallback(
    (data: { orderId: string; status: string }) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.orderId ? { ...o, status: data.status } : o
        )
      );
      toast.success(`Order status updated: ${data.status}`);
    },
    []
  );

  useSocket("orderStatusUpdated", handleStatusUpdate);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Place your first order from the menu!"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-lg border border-border bg-card p-5 animate-fade-in"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Stepper */}
              <OrderStepper status={order.status} />

              <div className="mt-4 space-y-1 text-sm">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-foreground">
                    <span>
                      {typeof item.menuItem === "object"
                        ? item.menuItem.name
                        : "Item"}{" "}
                      × {item.quantity}
                    </span>
                    <span>
                      {typeof item.menuItem === "object"
                        ? `$${(item.menuItem.price * item.quantity).toFixed(2)}`
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-2 font-semibold text-foreground">
                <span>Total</span>
                <span>${order.totalPrice?.toFixed(2)}</span>
              </div>
              {order.deliveryDetails && (
                <div className="mt-2 text-xs text-muted-foreground">
                  📍 {order.deliveryDetails.address} • 📞{" "}
                  {order.deliveryDetails.phone}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
