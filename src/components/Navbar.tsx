import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, KeyRound } from "lucide-react";
import garLogo from "@/assets/gar-logo.png";
import { isLoggedIn, isAdmin, getUserName, getToken, clearSession } from "@/services/auth";
import { logout, changePassword } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const [pwDialogOpen, setPwDialogOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast({ title: "Senhas não coincidem", variant: "destructive" });
      return;
    }
    const token = getToken();
    if (!token) return;
    setPwLoading(true);
    try {
      await changePassword(token, currentPw, newPw);
      toast({ title: "Senha alterada com sucesso!" });
      setPwDialogOpen(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao alterar senha";
      toast({ title: msg, variant: "destructive" });
    } finally {
      setPwLoading(false);
    }
  };

  const openPwDialog = () => {
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setOpen(false);
    setPwDialogOpen(true);
  };

  return (
    <>
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
            {loggedIn && (
              <Link
                to="/codigo-penal"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-secondary hover:text-primary ${
                  location.pathname === "/codigo-penal"
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground"
                }`}
              >
                Código Penal
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
                <button
                  onClick={openPwDialog}
                  title="Trocar senha"
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors font-display tracking-wide"
                >
                  <KeyRound size={13} />
                  {userName}
                </button>
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
            {loggedIn && (
              <Link
                to="/codigo-penal"
                onClick={() => setOpen(false)}
                className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                  location.pathname === "/codigo-penal"
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground"
                }`}
              >
                Código Penal
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
                  onClick={openPwDialog}
                  className="w-full text-left flex items-center gap-2 px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <KeyRound size={14} />
                  Trocar senha
                </button>
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

      {/* Dialog trocar senha */}
      <Dialog open={pwDialogOpen} onOpenChange={setPwDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound size={16} />
              Trocar Senha
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="current-pw">Senha atual</Label>
              <Input
                id="current-pw"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-pw">Nova senha</Label>
              <Input
                id="new-pw"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm-pw">Confirmar nova senha</Label>
              <Input
                id="confirm-pw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" disabled={pwLoading} className="mt-1">
              {pwLoading ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
