const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY as string;

export async function uploadToImgbb(dataUrl: string): Promise<string> {
  const base64 = dataUrl.split(",")[1];
  const form = new FormData();
  form.append("key", IMGBB_KEY);
  form.append("image", base64);
  const res = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("Falha na conexão com ImgBB");
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || "Erro ao fazer upload da imagem");
  return data.data.url as string;
}
