import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import MenuCard from "@/components/MenuCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Package } from "lucide-react";

describe("MenuCard", () => {
  it("renders item details", () => {
    const item = { _id: "1", name: "Burger", description: "Juicy beef burger", price: 12.99 };
    render(
      <BrowserRouter>
        <CartProvider>
          <MenuCard item={item} />
        </CartProvider>
      </BrowserRouter>
    );
    expect(screen.getByText("Burger")).toBeInTheDocument();
    expect(screen.getByText("Juicy beef burger")).toBeInTheDocument();
    expect(screen.getByText("$12.99")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });
});

describe("StatusBadge", () => {
  it.each(["Order Received", "Preparing", "Out for Delivery", "Delivered"])("renders %s", (status) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(status)).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState icon={Package} title="Empty" description="Nothing here" />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
