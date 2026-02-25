import { useEffect, useState } from "react";
import { orderAPI } from "@/services/api";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STATUSES = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];

interface Order {
  _id: string;
  items: any[];
  totalPrice: number;
  status: string;
  deliveryDetails?: { name: string; address: string; phone: string };
  createdAt: string;
  user?: { name: string; email: string };
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = (p: number) => {
    setLoading(true);
    orderAPI.getAll(p)
      .then((res) => {
        const data = res.data.orders || res.data;
        setOrders(Array.isArray(data) ? data : []);
        setHasMore(res.data.hasMore ?? data.length >= 10);
      })
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(page); }, [page]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await orderAPI.updateStatus(id, status);
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
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
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">#{order._id.slice(-6)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-4 py-3 text-foreground">{order.deliveryDetails?.name || order.user?.name || "—"}</td>
                <td className="px-4 py-3 font-medium text-foreground">${order.totalPrice?.toFixed(2)}</td>
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50">
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={!hasMore} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50">
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
