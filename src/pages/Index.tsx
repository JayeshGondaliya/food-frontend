import { Link } from "react-router-dom";
import { UtensilsCrossed, ArrowRight } from "lucide-react";

const Index = () => (
  <div className="flex min-h-[85vh] items-center justify-center px-4">
    <div className="max-w-2xl text-center animate-fade-in">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <UtensilsCrossed className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mb-4 font-display text-5xl font-bold leading-tight text-foreground md:text-6xl">
        Delicious Food,<br />
        <span className="text-primary">Delivered Fast</span>
      </h1>
      <p className="mx-auto mb-8 max-w-md text-lg text-muted-foreground">
        Browse our curated menu, order your favorites, and track delivery in real-time.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/menu"
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Menu <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/register"
          className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Create Account
        </Link>
      </div>
    </div>
  </div>
);

export default Index;
