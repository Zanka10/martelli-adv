const TZ = "America/Sao_Paulo";

export function formatDate(date: Date | string | null | undefined, withTime = false) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: withTime ? "2-digit" : "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(date));
}

export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function formatPhone(value: string) {
  let d = onlyDigits(value);
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return value;
}

/** Número no formato internacional exigido pelo wa.me (assume Brasil quando há só DDD + número). */
export function whatsappNumber(value: string) {
  const d = onlyDigits(value);
  if (d.length === 10 || d.length === 11) return `55${d}`;
  return d;
}

export function whatsappLink(number: string, text?: string) {
  const n = whatsappNumber(number);
  if (!n) return null;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function telLink(value: string) {
  return `tel:+${whatsappNumber(value)}`;
}

export function lines(text: string | null | undefined) {
  return (text ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function siteUrl(path = "") {
  return `${(process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "")}${path}`;
}
