import { useEffect, useState } from "react";
import { menuAPI } from "@/services/api";
import MenuCard from "@/components/MenuCard";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import { UtensilsCrossed, AlertCircle } from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const MenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    menuAPI.getAll()
      .then((res) => setItems(res.data.items || res.data))
      .catch(() => setError("Failed to load menu"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Our Menu</h1>
        <p className="mt-1 text-muted-foreground">Explore our delicious dishes</p>
      </div>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && (
        <EmptyState icon={AlertCircle} title="Something went wrong" description={error} />
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState icon={UtensilsCrossed} title="No items yet" description="The menu is being prepared. Check back soon!" />
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => <MenuCard key={item._id} item={item} />)}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
