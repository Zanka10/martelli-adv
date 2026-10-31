"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from "lucide-react";
import { uploadImage } from "./upload";

function ToolbarButton({ onClick, active, label, children, disabled }: { onClick: () => void; active?: boolean; label: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-8 w-8 items-center justify-center rounded-sm transition-colors disabled:opacity-40 ${
        active ? "bg-brown-900 text-gold-light" : "text-brown-700 hover:bg-sand"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Endereço do link (https://…)", prev ?? "https://");
    if (url === null) return;
    if (!url || url === "https://") return editor.chain().focus().unsetLink().run();
    if (!/^(https?:\/\/|mailto:|tel:|\/)/.test(url)) return window.alert("Informe um endereço válido começando com https://");
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: url.startsWith("/") ? null : "_blank" }).run();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      const alt = window.prompt("Descrição da imagem (texto alternativo):", "") ?? "";
      editor.chain().focus().setImage({ src: url, alt }).run();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Falha no envio da imagem.");
    } finally {
      setUploading(false);
    }
  };

  const c = () => editor.chain().focus();
  return (
    <div className="sticky top-16 z-10 flex flex-wrap items-center gap-0.5 border-b border-line bg-white p-1.5 lg:top-0">
      <ToolbarButton label="Título" active={editor.isActive("heading", { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Subtítulo" active={editor.isActive("heading", { level: 3 })} onClick={() => c().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" />
      <ToolbarButton label="Negrito" active={editor.isActive("bold")} onClick={() => c().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Itálico" active={editor.isActive("italic")} onClick={() => c().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Sublinhado" active={editor.isActive("underline")} onClick={() => c().toggleUnderline().run()}>
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Tachado" active={editor.isActive("strike")} onClick={() => c().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" />
      <ToolbarButton label="Lista" active={editor.isActive("bulletList")} onClick={() => c().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Lista numerada" active={editor.isActive("orderedList")} onClick={() => c().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Citação" active={editor.isActive("blockquote")} onClick={() => c().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Linha divisória" onClick={() => c().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" />
      <ToolbarButton label="Inserir link" active={editor.isActive("link")} onClick={setLink}>
        <Link2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Remover link" disabled={!editor.isActive("link")} onClick={() => c().unsetLink().run()}>
        <Unlink className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Inserir imagem" disabled={uploading} onClick={() => fileRef.current?.click()}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      </ToolbarButton>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFile} />
      <span className="mx-1 h-5 w-px bg-line" />
      <ToolbarButton label="Desfazer" disabled={!editor.can().undo()} onClick={() => c().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Refazer" disabled={!editor.can().redo()} onClick={() => c().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({ name, defaultValue = "", placeholder = "Escreva o conteúdo…", minHeight = 360 }: { name: string; defaultValue?: string; placeholder?: string; minHeight?: number }) {
  const [html, setHtml] = useState(defaultValue);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue,
    editorProps: { attributes: { class: "rich-text max-w-none px-5 py-4 focus:outline-none", style: `min-height:${minHeight}px` } },
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? "" : editor.getHTML()),
  });

  return (
    <div className="border border-line bg-white focus-within:border-gold">
      {editor ? <Toolbar editor={editor} /> : <div className="h-11 border-b border-line" />}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
