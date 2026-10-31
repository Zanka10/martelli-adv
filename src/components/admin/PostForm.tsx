"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, Save } from "lucide-react";
import { savePost } from "@/app/admin/actions/posts";
import type { FormState } from "@/app/admin/actions/types";
import { FieldError, FormAlert, StatefulForm, SubmitButton } from "./ui";
import { RichTextEditor } from "./RichTextEditor";
import { ImageField } from "./ImageField";

export type PostFormValues = {
  id?: string;
  title: string;
  subtitle: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  authorId: string;
  seoTitle: string;
  seoDescription: string;
  state: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  publishedAt: string | null; // ISO
};

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostForm({
  post,
  categories,
  authors,
  meta,
}: {
  post: PostFormValues;
  categories: { id: string; name: string }[];
  authors: { id: string; name: string }[];
  meta?: { createdAt: string; updatedAt: string; publicUrl: string | null };
}) {
  const [state, action] = useActionState<FormState, FormData>(savePost, {});
  const initialMode = post.state === "SCHEDULED" ? "schedule" : post.state === "PUBLISHED" ? "publish" : "draft";
  const [mode, setMode] = useState<"draft" | "publish" | "schedule">(initialMode);
  const [localDate, setLocalDate] = useState(post.state === "SCHEDULED" ? toLocalInput(post.publishedAt) : "");
  const [seoTitle, setSeoTitle] = useState(post.seoTitle);
  const [seoDescription, setSeoDescription] = useState(post.seoDescription);
  const fe = state.fieldErrors;
  const scheduledIso = localDate ? new Date(localDate).toISOString() : "";

  const modeLabel = { draft: "Salvar rascunho", publish: post.state === "PUBLISHED" ? "Atualizar publicação" : "Publicar agora", schedule: "Agendar publicação" }[mode];

  return (
    <StatefulForm action={action} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <input type="hidden" name="id" value={post.id ?? ""} />
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="scheduledAt" value={mode === "schedule" ? scheduledIso : ""} />

      <div className="min-w-0 space-y-6">
        <FormAlert state={state} />
        <div className="space-y-5 bg-white p-6">
          <div>
            <label htmlFor="title" className="field-label">Título *</label>
            <input id="title" name="title" defaultValue={post.title} required maxLength={200} className="field !text-lg" aria-invalid={fe?.title ? true : undefined} />
            <FieldError errors={fe} name="title" />
          </div>
          <div>
            <label htmlFor="subtitle" className="field-label">Subtítulo</label>
            <input id="subtitle" name="subtitle" defaultValue={post.subtitle} maxLength={300} className="field" />
          </div>
          <div>
            <label htmlFor="excerpt" className="field-label">Resumo</label>
            <textarea id="excerpt" name="excerpt" defaultValue={post.excerpt} rows={3} maxLength={500} className="field resize-y" />
            <p className="mt-1 text-xs text-muted">Exibido nas listagens. Se ficar em branco, será gerado a partir do conteúdo.</p>
            <FieldError errors={fe} name="excerpt" />
          </div>
        </div>
        <div>
          <p className="field-label">Conteúdo completo *</p>
          <RichTextEditor name="content" defaultValue={post.content} />
          <FieldError errors={fe} name="content" />
        </div>

        <details className="bg-white p-6" open={Boolean(post.seoTitle || post.seoDescription || fe?.seoTitle || fe?.seoDescription)}>
          <summary className="cursor-pointer font-serif text-xl text-brown-900">SEO e endereço da página</summary>
          <div className="mt-5 space-y-5">
            <div>
              <label htmlFor="slug" className="field-label">Endereço amigável (slug)</label>
              <div className="flex items-center">
                <span className="border border-r-0 border-line bg-sand px-3 py-[0.8rem] text-sm text-muted">/publicacoes/</span>
                <input id="slug" name="slug" defaultValue={post.slug} placeholder="gerado a partir do título" className="field" />
              </div>
            </div>
            <div>
              <label htmlFor="seoTitle" className="field-label">Título para buscadores</label>
              <input id="seoTitle" name="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70} className="field" />
              <p className="mt-1 text-xs text-muted">{seoTitle.length}/70 — opcional; por padrão usa o título.</p>
              <FieldError errors={fe} name="seoTitle" />
            </div>
            <div>
              <label htmlFor="seoDescription" className="field-label">Descrição para buscadores</label>
              <textarea id="seoDescription" name="seoDescription" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} maxLength={170} className="field resize-y" />
              <p className="mt-1 text-xs text-muted">{seoDescription.length}/170 — opcional; por padrão usa o resumo.</p>
              <FieldError errors={fe} name="seoDescription" />
            </div>
          </div>
        </details>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="bg-white p-6">
          <h2 className="font-serif text-xl text-brown-900">Publicação</h2>
          <fieldset className="mt-4 space-y-2">
            <legend className="sr-only">Status</legend>
            {(
              [
                ["draft", "Rascunho", "Visível apenas no painel"],
                ["publish", "Publicado", "Visível no site imediatamente"],
                ["schedule", "Agendado", "Publicado automaticamente na data escolhida"],
              ] as const
            ).map(([value, label, hint]) => (
              <label key={value} className={`flex cursor-pointer gap-3 border p-3 text-sm ${mode === value ? "border-gold bg-gold/10" : "border-line"}`}>
                <input type="radio" name="_mode" checked={mode === value} onChange={() => setMode(value)} className="mt-1 accent-[var(--color-gold-dark)]" />
                <span>
                  <span className="font-semibold text-brown-900">{label}</span>
                  <span className="block text-xs text-muted">{hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
          {mode === "schedule" && (
            <div className="mt-4">
              <label htmlFor="scheduledLocal" className="field-label">Data e hora</label>
              <input id="scheduledLocal" type="datetime-local" value={localDate} onChange={(e) => setLocalDate(e.target.value)} className="field" required />
              <FieldError errors={fe} name="scheduledAt" />
            </div>
          )}
          <div className="mt-5 flex flex-col gap-2">
            <SubmitButton className="btn btn-dark w-full" name="intent" value="save">
              <Save className="h-4 w-4" /> {modeLabel}
            </SubmitButton>
            <SubmitButton className="btn btn-outline w-full" name="intent" value="preview" pendingText="Abrindo…">
              <Eye className="h-4 w-4" /> Salvar e pré-visualizar
            </SubmitButton>
          </div>
          {meta && (
            <dl className="mt-5 space-y-1 border-t border-line pt-4 text-xs text-muted">
              <div className="flex justify-between"><dt>Criada em</dt><dd>{meta.createdAt}</dd></div>
              <div className="flex justify-between"><dt>Atualizada em</dt><dd>{meta.updatedAt}</dd></div>
              {meta.publicUrl && (
                <div className="pt-2">
                  <Link href={meta.publicUrl} target="_blank" className="font-semibold text-brown-700 underline">Ver no site</Link>
                </div>
              )}
            </dl>
          )}
        </div>

        <div className="space-y-5 bg-white p-6">
          <div>
            <label htmlFor="categoryId" className="field-label">Categoria</label>
            <select id="categoryId" name="categoryId" defaultValue={post.categoryId} className="field">
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Link href="/admin/categorias" className="mt-1 inline-block text-xs text-brown-700 underline">Gerenciar categorias</Link>
          </div>
          <div>
            <label htmlFor="authorId" className="field-label">Autor</label>
            <select id="authorId" name="authorId" defaultValue={post.authorId} className="field">
              <option value="">Escritório (sem autor individual)</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted">Autores são os integrantes cadastrados em Equipe.</p>
          </div>
          <ImageField name="coverImage" label="Imagem de capa" defaultValue={post.coverImage} hint="JPG, PNG ou WebP até 5 MB. Recomendado: 1600 × 900 px." />
          <FieldError errors={fe} name="coverImage" />
        </div>
      </aside>
    </StatefulForm>
  );
}
