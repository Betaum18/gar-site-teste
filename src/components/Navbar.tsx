import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import garLogo from "@/assets/gar-logo.png";

const navItems = [
  { label: "Início", path: "/" },
  { label: "Sobre", path: "/sobre" },
  { label: "Manual", path: "/manual" },
  { label: "Inscrição", path: "/inscricao" },
  { label: "Membros", path: "/membros" },
  { label: "Metas", path: "/metas" },
  { label: "Dashboard", path: "/dashboard" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={garLogo} alt="GAR Logo" className="h-9 w-9 rounded-full transition-all group-hover:drop-shadow-[0_0_8px_hsl(210,100%,55%)]" />
          <span className="font-display text-xl font-bold tracking-widest text-foreground">
            GAR
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-secondary hover:text-primary ${
                location.pathname === item.path
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground p-2"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                location.pathname === item.path
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
