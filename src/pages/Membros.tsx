import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionTitle from "@/components/SectionTitle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Trash2, LogOut, Lock } from "lucide-react";
import { toast } from "sonner";
import { getMembers, addMember, deleteMember, logout } from "@/services/api";
import { isLoggedIn, getToken, clearSession } from "@/services/auth";

const ROLES = [
  "COMANDO",
  "SUBCOMANDO",
  "TERCEIRO COMANDO",
  "PILOTO SÊNIOR",
  "PILOTO PLENO",
  "PILOTO JÚNIOR",
  "ESTAGIÁRIO",
];

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const Membros = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const isAdmin = isLoggedIn();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  const addMemberMutation = useMutation({
    mutationFn: () => {
      const token = getToken()!;
      return addMember(name, role, photoUrl, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setName("");
      setRole("");
      setPhotoUrl("");
      setOpen(false);
      toast.success("Membro adicionado com sucesso!");
    },
    onError: (err: Error) => toast.error(err.message || "Erro ao adicionar membro."),
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id: string) => deleteMember(id, getToken()!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Membro removido.");
    },
    onError: (err: Error) => toast.error(err.message || "Erro ao remover membro."),
  });

  const handleLogout = async () => {
    const token = getToken();
    if (token) {
      try { await logout(token); } catch { /* ignore */ }
    }
    clearSession();
    toast.success("Logout realizado.");
    navigate("/membros");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <SectionTitle
          title="MEMBROS DO G.A.R"
          subtitle="Efetivo atual do Grupamento de Acompanhamento Rápido."
        />

        <div className="flex justify-center gap-3 mb-10">
          {isAdmin ? (
            <>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus size={18} />
                    Cadastrar Membro
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="font-display tracking-wide">Novo Membro</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        placeholder="Nome do membro"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Cargo</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo_url">Foto (URL — opcional)</Label>
                      <Input
                        id="photo_url"
                        placeholder="https://i.imgur.com/exemplo.jpg"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full"
                      disabled={!name || !role || addMemberMutation.isPending}
                      onClick={() => addMemberMutation.mutate()}
                    >
                      {addMemberMutation.isPending ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="gap-2" onClick={handleLogout}>
                <LogOut size={16} />
                Sair
              </Button>
            </>
          ) : (
            <Button variant="outline" className="gap-2" onClick={() => navigate("/login")}>
              <Lock size={16} />
              Área Administrativa
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-tactical animate-pulse h-48" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum membro cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="card-tactical border-glow-blue text-center group hover:border-primary/40 transition-all relative"
              >
                {isAdmin && (
                  <button
                    onClick={() => deleteMemberMutation.mutate(member.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    title="Remover membro"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <div className="flex justify-center mb-4">
                  <Avatar className="h-20 w-20 border-2 border-primary/30">
                    {member.photo_url ? (
                      <AvatarImage src={member.photo_url} alt={member.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/20 text-primary font-display font-bold text-lg">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <h3 className="font-display text-sm font-semibold tracking-wide text-primary mb-1">
                  {member.name}
                </h3>
                <p className="text-xs font-bold tracking-wider text-accent">{member.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Membros;
