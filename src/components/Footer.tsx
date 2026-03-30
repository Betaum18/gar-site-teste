import { useState } from "react";
import { Shield } from "lucide-react";

const Footer = () => {
  const [flipping, setFlipping] = useState(false);

  const handleEasterEgg = () => {
    setFlipping(true);
    setTimeout(() => setFlipping(false), 1500);
  };

  return (
    <footer className="border-t border-border bg-tactical-darker py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display text-sm tracking-widest text-muted-foreground">
              GAR © 2026
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Grupamento de Acompanhamento Rápido — Site fictício para fins demonstrativos.
          </p>

          <button
            onClick={handleEasterEgg}
            className="text-muted-foreground hover:text-foreground transition-colors text-xs flex items-center gap-1 cursor-pointer"
            title="🤫"
          >
            🚔 Patrulha
            {flipping && (
              <span className="animate-flip-car inline-block ml-2 text-lg">🚗💥</span>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
