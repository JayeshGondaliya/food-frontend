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
        {/* Logo with hover scale */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-bold text-primary transition-transform hover:scale-105"
        >
          <UtensilsCrossed className="h-6 w-6" />
          FeastFlow
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/menu"
            className="text-base font-semibold text-muted-foreground transition-all duration-200 hover:scale-105 hover:text-primary"
          >
            Menu
          </Link>
          {user && (
            <>
              <Link
                to="/orders"
                className="text-base font-semibold text-muted-foreground transition-all duration-200 hover:scale-105 hover:text-primary"
              >
                My Orders
              </Link>
              {role === "admin" && (
                <Link
                  to="/admin"
                  className="text-base font-semibold text-muted-foreground transition-all duration-200 hover:scale-105 hover:text-primary"
                >
                  <span className="flex items-center gap-1">
                    <LayoutDashboard className="h-4 w-4" /> Admin
                  </span>
                </Link>
              )}
            </>
          )}

          {/* Cart icon with hover scale */}
          <Link
            to="/cart"
            className="relative text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-primary"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground transition-transform hover:scale-110">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-base font-semibold text-muted-foreground">
                <User className="h-4 w-4" /> {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-base font-semibold text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-destructive"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-primary px-4 py-2 text-base font-semibold text-primary-foreground transition-all duration-200 hover:scale-105 hover:bg-primary/90 hover:shadow-md"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle with hover effect */}
        <button
          className="md:hidden text-foreground transition-transform hover:scale-110"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu with hover effects */}
      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden animate-slide-down">
          <div className="flex flex-col gap-3">
            <Link
              to="/menu"
              onClick={() => setMobileOpen(false)}
              className="text-base font-semibold text-foreground rounded-lg px-3 py-2 transition-colors hover:bg-muted"
            >
              Menu
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="text-base font-semibold text-foreground flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
            >
              Cart{" "}
              {totalItems > 0 && (
                <span className="rounded-full bg-primary px-2 text-xs text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
            {user && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-foreground rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                >
                  My Orders
                </Link>
                {role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-semibold text-foreground rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="text-left text-base font-semibold text-destructive rounded-lg px-3 py-2 transition-colors hover:bg-destructive/10"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-primary rounded-lg px-3 py-2 transition-colors hover:bg-primary/10"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;