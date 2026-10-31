"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { uploadImage } from "./upload";

export function ImageField({
  name,
  label,
  defaultValue = "",
  hint,
  aspect = "aspect-[16/9]",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
  aspect?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setUrl(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no envio.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="field-label">{label}</p>
      <input type="hidden" name={name} value={url} />
      <div className={`relative ${aspect} overflow-hidden border border-dashed border-line bg-sand/50`}>
        {url ? (
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : (
          <button type="button" onClick={() => ref.current?.click()} className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-muted hover:text-brown-700">
            {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" strokeWidth={1.5} />}
            {busy ? "Enviando…" : "Selecionar imagem"}
          </button>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        {url && (
          <>
            <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="text-xs font-semibold text-brown-700 hover:text-gold-dark">
              {busy ? "Enviando…" : "Trocar imagem"}
            </button>
            <button type="button" onClick={() => setUrl("")} className="inline-flex items-center gap-1 text-xs font-semibold text-[#a2391f] hover:underline">
              <Trash2 className="h-3 w-3" /> Remover
            </button>
          </>
        )}
      </div>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onChange} />
      {error && <p className="field-error">{error}</p>}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
