import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X, LogOut, User, LayoutDashboard, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, role } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <UtensilsCrossed className="h-6 w-6" />
          FeastFlow
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/menu" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Menu
          </Link>
          {user && (
            <>
              <Link to="/orders" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                My Orders
              </Link>
              {role === "admin" && (
                <Link to="/admin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <span className="flex items-center gap-1"><LayoutDashboard className="h-4 w-4" /> Admin</span>
                </Link>
              )}
            </>
          )}

          <Link to="/cart" className="relative text-muted-foreground transition-colors hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-4 w-4" /> {user.name}
              </span>
              <button onClick={handleLogout} className="text-sm text-muted-foreground transition-colors hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-3">
            <Link to="/menu" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Menu</Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground flex items-center gap-2">
              Cart {totalItems > 0 && <span className="rounded-full bg-primary px-2 text-xs text-primary-foreground">{totalItems}</span>}
            </Link>
            {user && (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">My Orders</Link>
                {role === "admin" && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Admin</Link>
                )}
                <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="text-left text-sm text-destructive">Logout</button>
              </>
            )}
            {!user && (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-primary">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
