import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import garLogo from "@/assets/gar-logo.png";
import { isLoggedIn, isAdmin, getUserName, getToken, clearSession } from "@/services/auth";
import { logout } from "@/services/api";

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
  const navigate = useNavigate();

  // Re-reads on every render (re-renders on route change via useLocation)
  const loggedIn  = isLoggedIn();
  const userAdmin = isAdmin();
  const userName  = getUserName();

  const handleLogout = async () => {
    const token = getToken();
    if (token) {
      try { await logout(token); } catch { /* ignore */ }
    }
    clearSession();
    setOpen(false);
    navigate("/");
  };

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
          {loggedIn && (
            <Link
              to="/crimes"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-secondary hover:text-primary ${
                location.pathname === "/crimes"
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground"
              }`}
            >
              Crimes
            </Link>
          )}
          {userAdmin && (
            <Link
              to="/usuarios"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-secondary hover:text-primary ${
                location.pathname === "/usuarios"
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground"
              }`}
            >
              Usuários
            </Link>
          )}

          {/* Auth button */}
          {loggedIn ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <span className="text-xs text-muted-foreground font-display tracking-wide">
                {userName}
              </span>
              <button
                onClick={handleLogout}
                title="Sair"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-md text-sm font-medium border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
            >
              <LogIn size={15} />
              Entrar
            </Link>
          )}
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
          {loggedIn && (
            <Link
              to="/crimes"
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                location.pathname === "/crimes"
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground"
              }`}
            >
              Crimes
            </Link>
          )}
          {userAdmin && (
            <Link
              to="/usuarios"
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                location.pathname === "/usuarios"
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground"
              }`}
            >
              Usuários
            </Link>
          )}

          {/* Mobile auth */}
          {loggedIn ? (
            <>
              <div className="px-6 py-2 text-xs text-muted-foreground border-t border-border font-display tracking-wide">
                {userName}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-6 py-3 text-sm font-medium text-destructive hover:bg-secondary transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary border-t border-border hover:bg-secondary transition-colors"
            >
              <LogIn size={15} />
              Entrar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
