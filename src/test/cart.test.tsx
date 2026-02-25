import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";

const TestConsumer = () => {
  const { items, addItem, increaseQty, decreaseQty, removeItem, totalPrice, totalItems } = useCart();
  return (
    <div>
      <span data-testid="total-price">{totalPrice.toFixed(2)}</span>
      <span data-testid="total-items">{totalItems}</span>
      <button onClick={() => addItem({ _id: "1", name: "Pizza", price: 10 })}>Add Pizza</button>
      <button onClick={() => increaseQty("1")}>Increase</button>
      <button onClick={() => decreaseQty("1")}>Decrease</button>
      <button onClick={() => removeItem("1")}>Remove</button>
      {items.map((i) => (
        <div key={i._id} data-testid={`item-${i._id}`}>{i.name} x{i.quantity}</div>
      ))}
    </div>
  );
};

describe("CartContext", () => {
  beforeEach(() => localStorage.clear());

  it("adds item to cart", () => {
    render(<CartProvider><TestConsumer /></CartProvider>);
    fireEvent.click(screen.getByText("Add Pizza"));
    expect(screen.getByTestId("total-items").textContent).toBe("1");
    expect(screen.getByTestId("total-price").textContent).toBe("10.00");
  });

  it("increases quantity", () => {
    render(<CartProvider><TestConsumer /></CartProvider>);
    fireEvent.click(screen.getByText("Add Pizza"));
    fireEvent.click(screen.getByText("Increase"));
    expect(screen.getByTestId("total-items").textContent).toBe("2");
    expect(screen.getByTestId("total-price").textContent).toBe("20.00");
  });

  it("decreases quantity and removes at zero", () => {
    render(<CartProvider><TestConsumer /></CartProvider>);
    fireEvent.click(screen.getByText("Add Pizza"));
    fireEvent.click(screen.getByText("Decrease"));
    expect(screen.getByTestId("total-items").textContent).toBe("0");
  });

  it("removes item", () => {
    render(<CartProvider><TestConsumer /></CartProvider>);
    fireEvent.click(screen.getByText("Add Pizza"));
    fireEvent.click(screen.getByText("Remove"));
    expect(screen.getByTestId("total-items").textContent).toBe("0");
  });

  it("calculates total correctly with multiple adds", () => {
    render(<CartProvider><TestConsumer /></CartProvider>);
    fireEvent.click(screen.getByText("Add Pizza"));
    fireEvent.click(screen.getByText("Add Pizza")); // increases qty
    fireEvent.click(screen.getByText("Add Pizza"));
    expect(screen.getByTestId("total-price").textContent).toBe("30.00");
  });
});
