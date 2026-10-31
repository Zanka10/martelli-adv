import "server-only";
import nodemailer from "nodemailer";

export async function sendMail(to: string, subject: string, text: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[e-mail não enviado — SMTP não configurado]\nPara: ${to}\nAssunto: ${subject}\n${text}\n`);
    } else {
      console.error("SMTP não configurado: não foi possível enviar e-mail para", to);
    }
    return;
  }
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  await transport.sendMail({ from: SMTP_FROM || SMTP_USER, to, subject, text });
}
