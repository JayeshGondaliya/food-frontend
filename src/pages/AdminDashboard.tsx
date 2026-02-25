import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Package, UtensilsCrossed } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="mb-8 text-muted-foreground">Welcome, {user?.name}</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/orders" className="group rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">Manage Orders</h3>
          <p className="mt-1 text-sm text-muted-foreground">View and update order statuses</p>
        </Link>

        <Link to="/admin/menu" className="group rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
            <UtensilsCrossed className="h-6 w-6 text-accent-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">Manage Menu</h3>
          <p className="mt-1 text-sm text-muted-foreground">Add, edit, or remove menu items</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
