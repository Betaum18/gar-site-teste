import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/services/api";
import { hashPassword, isLoggedIn, saveSession } from "@/services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) navigate("/membros", { replace: true });
  }, [navigate]);

  const handleSubmit = async () => {
    if (!username || !password || loading) return;
    setLoading(true);
    try {
      const hash = await hashPassword(password);
      const { token, expires_at } = await login(username, hash);
      saveSession(token, expires_at);
      toast.success("Login realizado!");
      navigate("/membros", { replace: true });
    } catch {
      toast.error("Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card-tactical border-glow-blue w-full max-w-sm p-8 space-y-6">
        <div className="text-center">
          <LogIn className="mx-auto mb-3 text-primary" size={36} />
          <h1 className="font-display text-2xl font-bold tracking-widest text-primary">LOGIN</h1>
          <p className="text-sm text-muted-foreground mt-1">Área Administrativa</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <Button
            className="w-full"
            disabled={!username || !password || loading}
            onClick={handleSubmit}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
