import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionTitle from "@/components/SectionTitle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, User, Trash2, LogIn, LogOut, Lock } from "lucide-react";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";

const ROLES = [
  "COMANDO",
  "SUBCOMANDO",
  "TERCEIRO COMANDO",
  "PILOTO SÊNIOR",
  "PILOTO PLENO",
  "PILOTO JÚNIOR",
  "ESTAGIÁRIO",
];

const Membros = () => {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = !!session;

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const addMember = useMutation({
    mutationFn: async () => {
      let photo_url: string | null = null;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("member-photos")
          .upload(fileName, photoFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("member-photos")
          .getPublicUrl(fileName);
        photo_url = urlData.publicUrl;
      }
      const { error } = await supabase.from("members").insert({
        name,
        role,
        photo_url,
        display_order: members.length,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setName("");
      setRole("");
      setPhotoFile(null);
      setPhotoPreview(null);
      setOpen(false);
      toast.success("Membro adicionado com sucesso!");
    },
    onError: () => toast.error("Erro ao adicionar membro."),
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Membro removido.");
    },
  });

  const handleLogin = async () => {
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoginLoading(false);
    if (error) {
      toast.error("Credenciais inválidas.");
    } else {
      toast.success("Login realizado!");
      setLoginOpen(false);
      setEmail("");
      setPassword("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado.");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
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
                    <div className="flex flex-col items-center gap-3">
                      <Avatar className="h-20 w-20 border-2 border-primary/30">
                        {photoPreview ? (
                          <AvatarImage src={photoPreview} alt="Preview" />
                        ) : (
                          <AvatarFallback className="bg-primary/20 text-primary">
                            <User size={32} />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Label htmlFor="photo" className="cursor-pointer text-sm text-primary hover:underline">
                        {photoPreview ? "Alterar foto" : "Adicionar foto"}
                      </Label>
                      <input id="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" placeholder="Nome do membro" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Cargo</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" disabled={!name || !role || addMember.isPending} onClick={() => addMember.mutate()}>
                      {addMember.isPending ? "Salvando..." : "Salvar"}
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
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Lock size={16} />
                  Área Administrativa
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="font-display tracking-wide flex items-center gap-2">
                    <LogIn size={20} /> Login Administrativo
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="admin@gar.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                  </div>
                  <Button className="w-full" disabled={!email || !password || loginLoading} onClick={handleLogin}>
                    {loginLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
              <div key={member.id} className="card-tactical border-glow-blue text-center group hover:border-primary/40 transition-all relative">
                {isAdmin && (
                  <button
                    onClick={() => deleteMember.mutate(member.id)}
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
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <User size={32} />
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <h3 className="font-display text-sm font-semibold tracking-wide text-primary mb-1">{member.name}</h3>
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
