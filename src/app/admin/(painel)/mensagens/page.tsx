import type { Metadata } from "next";
import { Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate, whatsappLink } from "@/lib/format";
import { deleteMessage, toggleMessageRead } from "../../actions/content";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ConfirmSubmit } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/site/SocialIcons";

export const metadata: Metadata = { title: "Mensagens" };

export default async function MessagesPage() {
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <>
      <AdminPageHeader title="Mensagens" description="Recebidas pelo formulário da página de contato. Solicitações de orçamento chegam diretamente pelo WhatsApp." />
      {messages.length === 0 ? (
        <div className="bg-white p-12 text-center text-muted">Nenhuma mensagem recebida.</div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => {
            const wa = m.phone ? whatsappLink(m.phone, `Olá, ${m.name.split(" ")[0]}! Recebemos sua mensagem pelo site.`) : null;
            return (
              <li key={m.id} className={`bg-white p-5 ${m.read ? "" : "border-l-4 border-gold"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-brown-900">
                      {m.name} {!m.read && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-bold text-brown-950 uppercase">Nova</span>}
                    </p>
                    <p className="text-xs text-muted">{formatDate(m.createdAt, true)}{m.subject ? ` · ${m.subject}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {m.email && (
                      <a href={`mailto:${m.email}`} title={m.email} aria-label="Responder por e-mail" className="flex h-8 w-8 items-center justify-center text-brown-700 hover:text-gold-dark">
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {m.phone && (
                      <a href={`tel:${m.phone}`} title={m.phone} aria-label="Ligar" className="flex h-8 w-8 items-center justify-center text-brown-700 hover:text-gold-dark">
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                    {wa && (
                      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Responder pelo WhatsApp" className="flex h-8 w-8 items-center justify-center text-brown-700 hover:text-gold-dark">
                        <WhatsAppIcon className="h-4 w-4" />
                      </a>
                    )}
                    <form action={toggleMessageRead.bind(null, m.id)}>
                      <button type="submit" aria-label={m.read ? "Marcar como não lida" : "Marcar como lida"} title={m.read ? "Marcar como não lida" : "Marcar como lida"} className="flex h-8 w-8 items-center justify-center text-brown-700 hover:text-gold-dark">
                        <MailOpen className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={deleteMessage.bind(null, m.id)}>
                      <ConfirmSubmit message="Excluir esta mensagem?" className="flex h-8 w-8 items-center justify-center text-[#a2391f]">
                        <Trash2 className="h-4 w-4" aria-label="Excluir" />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ink/85">{m.message}</p>
                <p className="mt-3 text-xs text-muted">{[m.email, m.phone].filter(Boolean).join(" · ")}</p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
