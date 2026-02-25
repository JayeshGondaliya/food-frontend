import { UtensilsCrossed } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card py-8">
    <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-center">
      <div className="flex items-center gap-2 font-display text-lg font-bold text-primary">
        <UtensilsCrossed className="h-5 w-5" /> FeastFlow
      </div>
      <p className="text-sm text-muted-foreground">Delicious food, delivered fast.</p>
      <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} FeastFlow. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
