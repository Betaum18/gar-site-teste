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
import { UserPlus, Trash2, LogOut, Lock, ImagePlus, X, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { getMembers, addMember, editMember, deleteMember, logout, type Member } from "@/services/api";
import { isAdmin, getToken, clearSession } from "@/services/auth";
import { uploadToImgbb } from "@/services/imgbb";

const ROLES = [
  "COMANDO",
  "SUBCOMANDO",
  "TERCEIRO COMANDO",
  "PILOTO SÊNIOR",
  "PILOTO PLENO",
  "PILOTO JÚNIOR",
  "ESTAGIÁRIO",
  "SUPLENTE",
];

function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

async function compressImage(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const MAX = 400;
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
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Shared drop-zone component state helper
function usePhotoUpload() {
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | Blob | null) => {
    if (!file) return;
    if (file instanceof File && !file.type.startsWith("image/")) {
      toast.error("Arquivo não é uma imagem.");
      return;
    }
    try {
      setUploading(true);
      const dataUrl = await compressImage(file);
      const url = await uploadToImgbb(dataUrl);
      setPhotoUrl(url);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao fazer upload da imagem.");
    } finally {
      setUploading(false);
    }
  };

  return { photoUrl, setPhotoUrl, uploading, dragging, setDragging, fileRef, handleFile };
}

function PhotoDropZone({
  photoUrl, uploading, dragging, fileRef, onFile, onClear, onDragOver, onDragLeave,
}: {
  photoUrl: string; uploading: boolean; dragging: boolean; fileRef: React.RefObject<HTMLInputElement>;
  onFile: (f: File | Blob | null) => void; onClear: () => void;
  onDragOver: () => void; onDragLeave: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Foto (opcional)</Label>
      <div
        onClick={() => !photoUrl && !uploading && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
        onDragLeave={onDragLeave}
        onDrop={(e) => { e.preventDefault(); onDragLeave(); onFile(e.dataTransfer.files[0] ?? null); }}
        className={`relative flex flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors
          ${photoUrl ? "border-primary/40 p-1" : "cursor-pointer p-6 hover:border-primary/60"}
          ${dragging ? "border-primary bg-primary/10" : "border-border"}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 size={28} className="animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Enviando para ImgBB...</p>
          </div>
        ) : photoUrl ? (
          <>
            <img
              src={photoUrl} alt="Preview"
              className="max-h-40 rounded object-contain cursor-pointer"
              onClick={() => fileRef.current?.click()}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
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
        ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

const Membros = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userIsAdmin = isAdmin();

  // ---- Add dialog state ----
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const addPhoto = usePhotoUpload();

  // ---- Edit dialog state ----
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const editPhoto = usePhotoUpload();

  // Paste → add dialog
  useEffect(() => {
    if (!addOpen) return;
    const handler = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
      const blob = item?.getAsFile();
      if (blob) addPhoto.handleFile(blob);
    };
    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [addOpen]);

  // Paste → edit dialog
  useEffect(() => {
    if (!editingMember) return;
    const handler = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
      const blob = item?.getAsFile();
      if (blob) editPhoto.handleFile(blob);
    };
    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [editingMember]);

  const openEdit = (member: Member) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditRole(member.role);
    editPhoto.setPhotoUrl(member.photo_url ?? "");
  };

  const closeEdit = () => {
    setEditingMember(null);
    setEditName("");
    setEditRole("");
    editPhoto.setPhotoUrl("");
  };

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  const addMemberMutation = useMutation({
    mutationFn: () => addMember(name, role, addPhoto.photoUrl, getToken()!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setName(""); setRole(""); addPhoto.setPhotoUrl("");
      setAddOpen(false);
      toast.success("Membro adicionado com sucesso!");
    },
    onError: (err: Error) => toast.error(err.message || "Erro ao adicionar membro."),
  });

  const editMemberMutation = useMutation({
    mutationFn: () => editMember(editingMember!.id, editName, editRole, editPhoto.photoUrl, getToken()!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      closeEdit();
      toast.success("Membro atualizado!");
    },
    onError: (err: Error) => toast.error(err.message || "Erro ao atualizar membro."),
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
    if (token) { try { await logout(token); } catch { /* ignore */ } }
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
          {userIsAdmin ? (
            <>
              {/* Add dialog */}
              <Dialog open={addOpen} onOpenChange={(v) => { setAddOpen(v); if (!v) { setName(""); setRole(""); addPhoto.setPhotoUrl(""); } }}>
                <DialogTrigger asChild>
                  <Button className="gap-2"><UserPlus size={18} />Cadastrar Membro</Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="font-display tracking-wide">Novo Membro</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <PhotoDropZone
                      photoUrl={addPhoto.photoUrl} uploading={addPhoto.uploading}
                      dragging={addPhoto.dragging} fileRef={addPhoto.fileRef}
                      onFile={addPhoto.handleFile} onClear={() => addPhoto.setPhotoUrl("")}
                      onDragOver={() => addPhoto.setDragging(true)} onDragLeave={() => addPhoto.setDragging(false)}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" placeholder="Nome do membro" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Cargo</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                        <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" disabled={!name || !role || addMemberMutation.isPending || addPhoto.uploading} onClick={() => addMemberMutation.mutate()}>
                      {addMemberMutation.isPending ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="gap-2" onClick={handleLogout}>
                <LogOut size={16} />Sair
              </Button>
            </>
          ) : (
            <Button variant="outline" className="gap-2" onClick={() => navigate("/login")}>
              <Lock size={16} />Área Administrativa
            </Button>
          )}
        </div>

        {/* Edit dialog */}
        <Dialog open={!!editingMember} onOpenChange={(v) => { if (!v) closeEdit(); }}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display tracking-wide">Editar Membro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <PhotoDropZone
                photoUrl={editPhoto.photoUrl} uploading={editPhoto.uploading}
                dragging={editPhoto.dragging} fileRef={editPhoto.fileRef}
                onFile={editPhoto.handleFile} onClear={() => editPhoto.setPhotoUrl("")}
                onDragOver={() => editPhoto.setDragging(true)} onDragLeave={() => editPhoto.setDragging(false)}
              />
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input id="edit-name" placeholder="Nome do membro" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Cargo</Label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                  <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button className="w-full" disabled={!editName || !editRole || editMemberMutation.isPending || editPhoto.uploading} onClick={() => editMemberMutation.mutate()}>
                {editMemberMutation.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
            {members.slice().sort((a, b) => ROLES.indexOf(a.role) - ROLES.indexOf(b.role)).map((member) => (
              <div
                key={member.id}
                className="card-tactical border-glow-blue text-center group hover:border-primary/40 transition-all relative"
              >
                {userIsAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(member)}
                      className="text-muted-foreground hover:text-primary"
                      title="Editar membro"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => deleteMemberMutation.mutate(member.id)}
                      className="text-muted-foreground hover:text-destructive"
                      title="Remover membro"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
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
