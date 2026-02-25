import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe("LoginPage", () => {
  it("renders login form", () => {
    render(<LoginPage />, { wrapper: Wrapper });
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("has link to register", () => {
    render(<LoginPage />, { wrapper: Wrapper });
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });
});

describe("RegisterPage", () => {
  it("renders register form", () => {
    render(<RegisterPage />, { wrapper: Wrapper });
    expect(screen.getByText("Create account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  it("has link to login", () => {
    render(<RegisterPage />, { wrapper: Wrapper });
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });
});
