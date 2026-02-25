import { Link } from "react-router-dom";
import { UtensilsCrossed, ArrowRight } from "lucide-react";

const Index = () => (
  <div
    className="relative flex min-h-[91vh] items-center justify-center px-4 bg-cover bg-center"
    style={{ backgroundImage: "url('/Banner.jpeg')" }}
  >
    {/* Dark overlay for better text contrast */}
    <div className="absolute inset-0 bg-black/50" />
    
    <div className="relative max-w-2xl text-center animate-fade-in z-10">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm">
        <UtensilsCrossed className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mb-4 font-display text-5xl font-bold leading-tight text-white md:text-6xl">
        Delicious Food,<br />
        <span className="text-primary">Delivered Fast</span>
      </h1>
      <p className="mx-auto mb-8 max-w-md text-lg text-gray-200">
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
          className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Create Account
        </Link>
      </div>
    </div>
  </div>
);

export default Index;