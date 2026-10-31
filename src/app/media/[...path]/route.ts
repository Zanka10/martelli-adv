import { readFile } from "fs/promises";
import path from "path";
import { IMAGE_TYPES, UPLOAD_DIR } from "@/lib/uploads";

// Serve as imagens enviadas pelo painel (pasta /uploads fora de /public).
export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  if (parts.some((p) => !/^[\w.-]+$/.test(p) || p.startsWith("."))) return new Response("Não encontrado", { status: 404 });
  const filePath = path.join(UPLOAD_DIR, ...parts);
  if (!filePath.startsWith(UPLOAD_DIR + path.sep)) return new Response("Não encontrado", { status: 404 });
  const type = IMAGE_TYPES[path.extname(filePath).slice(1).toLowerCase()];
  if (!type) return new Response("Não encontrado", { status: 404 });
  try {
    const data = await readFile(filePath);
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new Response("Não encontrado", { status: 404 });
  }
}
