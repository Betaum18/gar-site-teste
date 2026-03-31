import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Trash2, ShieldCheck, Pencil } from "lucide-react";
import { toast } from "sonner";
import { getUsers, addUser, editUser, deleteUser, getMembers, type UserEntry } from "@/services/api";
import { isLoggedIn, isAdmin, getToken } from "@/services/auth";

const Usuarios = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ---- Add dialog ----
  const [open, setOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminUser, setIsAdminUser] = useState(false);

  // ---- Edit dialog ----
  const [editingUser, setEditingUser] = useState<UserEntry | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editIsAdmin, setEditIsAdmin] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/login", { replace: true }); return; }
    if (!isAdmin())    { navigate("/membros", { replace: true }); }
  }, [navigate]);

  const token = getToken()!;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(token),
    enabled: isAdmin(),
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
    enabled: isAdmin(),
  });

  const availableMembers = members.filter(
    (m) => !users.some((u) => u.member_id === m.id)
  );

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  const openEdit = (user: UserEntry) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditPassword("");
    setEditIsAdmin(user.user_type === "admin");
  };

  const closeEdit = () => {
    setEditingUser(null);
    setEditUsername("");
    setEditPassword("");
    setEditIsAdmin(false);
  };

  const addUserMutation = useMutation({
    mutationFn: () =>
      addUser(token, selectedMemberId, selectedMember?.name ?? "", username, password, isAdminUser ? "admin" : "member"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpen(false);
      setSelectedMemberId(""); setUsername(""); setPassword(""); setIsAdminUser(false);
      toast.success("Usuário criado com sucesso!");
    },
    onError: (err: Error) => toast.error(err.message || "Erro ao criar usuário."),
  });

  const editUserMutation = useMutation({
    mutationFn: () =>
      editUser(token, editingUser!.id, editUsername, editPassword, editIsAdmin ? "admin" : "member"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeEdit();
      toast.success("Usuário atualizado!");
    },
    onError: (err: Error) => toast.error(err.message || "Erro ao atualizar usuário."),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário removido.");
    },
    onError: (err: Error) => toast.error(err.message || "Erro ao remover usuário."),
  });

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString("pt-BR"); } catch { return iso; }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <SectionTitle
          title="USUÁRIOS"
          subtitle="Gerencie os acessos dos membros ao sistema."
        />

        <div className="flex justify-center mb-10">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><UserPlus size={18} />Novo Usuário</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-display tracking-wide">Criar Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                {members.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Cadastre membros na página{" "}
                    <a href="/membros" className="text-primary hover:underline">/membros</a>{" "}
                    antes de criar usuários.
                  </p>
                ) : availableMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Todos os membros já possuem acesso ao sistema.
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Membro</Label>
                      <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                        <SelectTrigger><SelectValue placeholder="Selecione o membro" /></SelectTrigger>
                        <SelectContent>
                          {availableMembers.map((m) => (
                            <SelectItem key={m.id} value={m.id}>{m.name} — {m.role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Usuário</Label>
                      <Input id="username" placeholder="nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-3 py-1">
                      <Checkbox id="is-admin" checked={isAdminUser} onCheckedChange={(v) => setIsAdminUser(v === true)} />
                      <Label htmlFor="is-admin" className="cursor-pointer flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-primary" />
                        Administrador
                      </Label>
                    </div>
                    <Button
                      className="w-full"
                      disabled={!selectedMemberId || !username || !password || addUserMutation.isPending}
                      onClick={() => addUserMutation.mutate()}
                    >
                      {addUserMutation.isPending ? "Criando..." : "Criar"}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit dialog */}
        <Dialog open={!!editingUser} onOpenChange={(v) => { if (!v) closeEdit(); }}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display tracking-wide">
                Editar Usuário — {editingUser?.member_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Usuário</Label>
                <Input id="edit-username" placeholder="nome de usuário" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Nova senha</Label>
                <Input
                  id="edit-password" type="password"
                  placeholder="Deixe em branco para manter a atual"
                  value={editPassword} onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 py-1">
                <Checkbox id="edit-is-admin" checked={editIsAdmin} onCheckedChange={(v) => setEditIsAdmin(v === true)} />
                <Label htmlFor="edit-is-admin" className="cursor-pointer flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-primary" />
                  Administrador
                </Label>
              </div>
              <Button
                className="w-full"
                disabled={!editUsername || editUserMutation.isPending}
                onClick={() => editUserMutation.mutate()}
              >
                {editUserMutation.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-tactical animate-pulse h-16" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum usuário cadastrado ainda.</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="card-tactical border-glow-blue flex items-center justify-between gap-4 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold text-primary tracking-wide">
                      {user.member_name}
                    </p>
                    {user.user_type === "admin" && (
                      <span className="flex items-center gap-1 text-xs font-medium text-accent">
                        <ShieldCheck size={12} />
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    @{user.username} · criado em {formatDate(String(user.created_at))}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(user)}
                    className="text-muted-foreground hover:text-primary"
                    title="Editar usuário"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => deleteUserMutation.mutate(user.id)}
                    className="text-muted-foreground hover:text-destructive"
                    title="Remover usuário"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
