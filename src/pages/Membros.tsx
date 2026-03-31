import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionTitle from "@/components/SectionTitle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Trash2, LogOut, Lock, ImagePlus, X } from "lucide-react";
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

async function compressImage(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const MAX = 200;
      let { width, height } = img;
      if (width > height) {
        if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      } else {
        if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
}

const Membros = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = isLoggedIn();

  // Ctrl+V paste listener (only when dialog is open)
  useEffect(() => {
    if (!open) return;
    const handlePaste = async (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith("image/")
      );
      if (!item) return;
      const blob = item.getAsFile();
      if (!blob) return;
      try {
        setPhotoUrl(await compressImage(blob));
      } catch {
        toast.error("Não foi possível processar a imagem.");
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [open]);

  const handleImageFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Arquivo não é uma imagem.");
      return;
    }
    try {
      setPhotoUrl(await compressImage(file));
    } catch {
      toast.error("Não foi possível processar a imagem.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageFile(e.dataTransfer.files[0] ?? null);
  };

  const resetForm = () => {
    setName("");
    setRole("");
    setPhotoUrl("");
  };

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  const addMemberMutation = useMutation({
    mutationFn: () => addMember(name, role, photoUrl, getToken()!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      resetForm();
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
              <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
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

                    {/* Photo drop zone */}
                    <div className="space-y-2">
                      <Label>Foto (opcional)</Label>
                      <div
                        onClick={() => !photoUrl && fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`relative flex flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors
                          ${photoUrl ? "border-primary/40 p-1" : "cursor-pointer p-6 hover:border-primary/60"}
                          ${isDragging ? "border-primary bg-primary/10" : "border-border"}`}
                      >
                        {photoUrl ? (
                          <>
                            <img
                              src={photoUrl}
                              alt="Preview"
                              className="max-h-40 rounded object-contain cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                            />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setPhotoUrl(""); }}
                              className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5 text-muted-foreground hover:text-destructive"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <ImagePlus size={28} className="mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground text-center">
                              Arraste, <kbd className="rounded bg-secondary px-1 py-0.5 text-xs">Ctrl+V</kbd> ou clique para adicionar
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFile(e.target.files?.[0] ?? null)}
                      />
                    </div>

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
