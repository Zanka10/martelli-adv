"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { FacebookIcon, LinkedinIcon, WhatsAppIcon } from "./SocialIcons";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare("share" in navigator), []);
  const enc = encodeURIComponent;
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} — ${url}`)}`, Icon: WhatsAppIcon },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, Icon: LinkedinIcon },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, Icon: FacebookIcon },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copie o link:", url);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      /* compartilhamento cancelado */
    }
  }

  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-brown-700 transition-colors hover:border-gold hover:text-gold-dark";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-xs font-bold tracking-[0.16em] text-muted uppercase">Compartilhar</span>
      {links.map(({ label, href, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Compartilhar no ${label}`} className={btn}>
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button type="button" onClick={copy} aria-label="Copiar link" className={btn}>
        {copied ? <Check className="h-4 w-4 text-gold-dark" /> : <Link2 className="h-4 w-4" />}
      </button>
      {canShare && (
        <button type="button" onClick={nativeShare} aria-label="Mais opções de compartilhamento" className={`${btn} sm:hidden`}>
          <Share2 className="h-4 w-4" />
        </button>
      )}
      <span role="status" className="sr-only">{copied ? "Link copiado" : ""}</span>
    </div>
  );
}
