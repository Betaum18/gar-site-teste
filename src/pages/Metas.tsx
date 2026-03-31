import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionTitle from "@/components/SectionTitle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Trash2, ImagePlus, X, Car } from "lucide-react";
import { toast } from "sonner";
import { addOcorrencia, getOcorrencias, deleteOcorrencia, getMembers } from "@/services/api";
import { isLoggedIn, isAdmin, getToken, getUserId, getUserName } from "@/services/auth";

function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

async function compressImage(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const MAX = 80;
      let { width, height } = img;
      if (width > height) {
        if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      } else {
        if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = reject;
    img.src = url;
  });
}

const Metas = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year]  = useState(now.getFullYear());

  useEffect(() => {
    if (!isLoggedIn()) navigate("/login", { replace: true });
  }, [navigate]);

  const token     = getToken()!;
  const userIsAdmin = isAdmin();

  // Paste listener
  useEffect(() => {
    if (!open) return;
    const handlePaste = async (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
      if (!item) return;
      const blob = item.getAsFile();
      if (!blob) return;
      try { setPhotoUrl(await compressImage(blob)); }
      catch { toast.error("Não foi possível processar a imagem."); }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [open]);

  const handleImageFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Arquivo não é uma imagem."); return; }
    try { setPhotoUrl(await compressImage(file)); }
    catch { toast.error("Não foi possível processar a imagem."); }
  };

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
    enabled: userIsAdmin,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["ocorrencias", month, year],
    queryFn: () => getOcorrencias(month, year),
    enabled: isLoggedIn(),
  });

  const ocorrencias = data?.ocorrencias ?? [];

  // Filter: admin sees all, member sees only own
  const userId = getUserId();
  const visibleOcorrencias = userIsAdmin
    ? ocorrencias
    : ocorrencias.filter((o) => o.member_id === userId);

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  const resetForm = () => {
    setDescricao("");
    setPhotoUrl("");
    setSelectedMemberId("");
  };

  const addOcorrenciaMutation = useMutation({
    mutationFn: () => {
      if (userIsAdmin) {
        return addOcorrencia(token, descricao, photoUrl, selectedMemberId, selectedMember?.name);
      }
      return addOcorrencia(token, descricao, photoUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ocorrencias"] });
      resetForm();
      setOpen(false);
      toast.success("Ocorrência registrada!");
    },
    onError: (err: Error) => toast.error(err.message || "Erro ao registrar ocorrência."),
  });

  const deleteOcorrenciaMutation = useMutation({
    mutationFn: (id: string) => deleteOcorrencia(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ocorrencias"] });
      toast.success("Ocorrência removida.");
    },
    onError: (err: Error) => toast.error(err.message || "Erro ao remover."),
  });

  const canSubmit = descricao.trim().length > 0 && (!userIsAdmin || selectedMemberId);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <SectionTitle
          title={userIsAdmin ? "OCORRÊNCIAS" : "MINHAS METAS"}
          subtitle={userIsAdmin ? "Todas as apreensões registradas no mês." : `Apreensões registradas por ${getUserName() ?? "você"}.`}
        />

        <div className="flex justify-center mb-10">
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle size={18} />
                Registrar Ocorrência
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-display tracking-wide">Nova Ocorrência</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">

                {/* Admin: member selector */}
                {userIsAdmin && (
                  <div className="space-y-2">
                    <Label>Membro responsável</Label>
                    <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                      <SelectTrigger><SelectValue placeholder="Selecione o membro" /></SelectTrigger>
                      <SelectContent>
                        {members.map((m) => (
                          <SelectItem key={m.id} value={m.id}>{m.name} — {m.role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Photo drop zone */}
                <div className="space-y-2">
                  <Label>Foto da ocorrência (opcional)</Label>
                  <div
                    onClick={() => !photoUrl && fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageFile(e.dataTransfer.files[0] ?? null); }}
                    className={`relative flex flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors
                      ${photoUrl ? "border-primary/40 p-1" : "cursor-pointer p-5 hover:border-primary/60"}
                      ${isDragging ? "border-primary bg-primary/10" : "border-border"}`}
                  >
                    {photoUrl ? (
                      <>
                        <img src={photoUrl} alt="Preview" className="max-h-36 rounded object-contain cursor-pointer" onClick={() => fileInputRef.current?.click()} />
                        <button type="button" onClick={(e) => { e.stopPropagation(); setPhotoUrl(""); }} className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5 text-muted-foreground hover:text-destructive">
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <ImagePlus size={26} className="mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center">
                          Arraste, <kbd className="rounded bg-secondary px-1 py-0.5 text-xs">Ctrl+V</kbd> ou clique
                        </p>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFile(e.target.files?.[0] ?? null)} />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição da ocorrência</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva a ocorrência, placa do veículo, local..."
                    className="min-h-[100px] resize-none"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>

                <Button className="w-full" disabled={!canSubmit || addOcorrenciaMutation.isPending} onClick={() => addOcorrenciaMutation.mutate()}>
                  {addOcorrenciaMutation.isPending ? "Registrando..." : "Registrar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-tactical animate-pulse h-28" />
            ))}
          </div>
        ) : visibleOcorrencias.length === 0 ? (
          <div className="text-center py-16">
            <Car size={48} className="mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">Nenhuma ocorrência registrada ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...visibleOcorrencias].reverse().map((oc) => (
              <div key={oc.id} className="card-tactical border-glow-blue flex gap-4 group relative">
                {/* Photo thumbnail */}
                {oc.photo_url && (
                  <img src={oc.photo_url} alt="ocorrência" className="h-20 w-20 rounded object-cover flex-shrink-0 border border-border" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6 border border-primary/30">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        {getInitials(oc.member_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-display text-xs font-semibold text-primary tracking-wide">{oc.member_name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{formatDate(String(oc.created_at))}</span>
                  </div>
                  <p className="text-sm text-foreground/80 line-clamp-3">{oc.descricao}</p>
                </div>
                {userIsAdmin && (
                  <button
                    onClick={() => deleteOcorrenciaMutation.mutate(oc.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    title="Remover"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Metas;
