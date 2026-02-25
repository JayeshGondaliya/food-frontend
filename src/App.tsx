import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrdersPage /></ProtectedRoute>} />
                  <Route path="/admin/menu" element={<ProtectedRoute adminOnly><AdminMenuPage /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
