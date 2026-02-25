import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const MenuCard = ({ item }: { item: MenuItem }) => {
  const { addItem } = useCart();

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md animate-fade-in">
      <div className="relative h-44 overflow-hidden bg-muted">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-4xl">🍽️</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
          <button
            onClick={() => addItem(item)}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
