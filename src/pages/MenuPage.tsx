import { useEffect, useState, useMemo } from "react";
import { menuAPI } from "@/services/api";
import MenuCard from "@/components/MenuCard";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import { UtensilsCrossed, AlertCircle, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}

const MenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"default" | "low" | "high">("default");

  useEffect(() => {
    menuAPI
      .getAll()
      .then((res) => setItems(res.data.items || res.data))
      .catch(() => setError("Failed to load menu"))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category || "Other"));
    return ["All", ...Array.from(cats).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((i) => (i.category || "Other") === selectedCategory);
    }

    if (sortOrder === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [items, search, selectedCategory, sortOrder]);

  const cycleSortOrder = () => {
    setSortOrder((prev) =>
      prev === "default" ? "low" : prev === "low" ? "high" : "default"
    );
  };

  const sortLabel =
    sortOrder === "low"
      ? "Price: Low → High"
      : sortOrder === "high"
      ? "Price: High → Low"
      : "Sort by Price";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Our Menu</h1>
        <p className="mt-1 text-muted-foreground">Explore our delicious dishes</p>
      </div>

      {/* Search & Filters */}
      {!loading && !error && items.length > 0 && (
        <div className="mb-6 space-y-4 animate-fade-in">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <SlidersHorizontal className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort toggle */}
            <button
              onClick={cycleSortOrder}
              className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                sortOrder !== "default"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {sortLabel}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {error && (
        <EmptyState
          icon={AlertCircle}
          title="Something went wrong"
          description={error}
        />
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon={UtensilsCrossed}
          title="No items yet"
          description="The menu is being prepared. Check back soon!"
        />
      )}

      {!loading && !error && items.length > 0 && filtered.length === 0 && (
        <EmptyState
          icon={Search}
          title="No results found"
          description="Try adjusting your search or filters."
          action={
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSortOrder("default");
              }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Clear Filters
            </button>
          }
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
