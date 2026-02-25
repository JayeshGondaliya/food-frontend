import { useEffect, useState } from "react";
import { orderAPI } from "@/services/api";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

// Backend status values (must match exactly)
const BACKEND_STATUSES = ["received", "preparing", "out_for_delivery", "delivered"] as const;
type BackendStatus = typeof BACKEND_STATUSES[number];

// Friendly labels for display
const STATUS_LABELS: Record<BackendStatus, string> = {
  received: "Order Received",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered"
};

interface OrderItem {
  menuItemId: {
    _id: string;
    name: string;
    price: number;
  } | null;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  customerName: string;
  address: string;
  phone: string;
  status: BackendStatus; // Now strongly typed
  createdAt: string;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    orderAPI
      .getAll()
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: BackendStatus) => {
    // Optimistically update UI
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
    setUpdatingId(orderId);

    try {
      await orderAPI.updateStatus(orderId, newStatus); // Send backend value
      toast.success(`Status updated to ${STATUS_LABELS[newStatus]}`);
    } catch (error) {
      // Revert on error
      setOrders(previousOrders);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Manage Orders</h1>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {orders.map((order) => {
              const total = order.items.reduce(
                (sum, item) => sum + (item.menuItemId?.price || 0) * item.quantity,
                0
              );

              return (
                <tr key={order._id} className={updatingId === order._id ? "opacity-50" : ""}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">#{order._id.slice(-6)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-foreground">{order.customerName}</td>
                  <td className="px-4 py-3 font-medium text-foreground">${total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value as BackendStatus)}
                      disabled={updatingId === order._id}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                    >
                      {BACKEND_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;