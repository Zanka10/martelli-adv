import "server-only";
import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const IMAGE_TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

// Identifica o tipo real pelo conteúdo (não confia na extensão enviada).
function detectImage(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

export async function saveImageUpload(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("A imagem deve ter no máximo 5 MB.");
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = detectImage(buf);
  if (!ext) throw new Error("Formato não suportado. Envie JPG, PNG ou WebP.");
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const name = `${randomBytes(12).toString("hex")}.${ext}`;
  await mkdir(path.join(UPLOAD_DIR, year, month), { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, year, month, name), buf);
  return `/media/${year}/${month}/${name}`;
}

export function isAllowedImageUrl(url: string) {
  return url === "" || /^\/media\/[\w/.-]+$/.test(url) || /^https:\/\/[^\s"'<>]+$/.test(url);
}
