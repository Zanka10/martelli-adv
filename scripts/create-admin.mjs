// Cria (ou redefine) um usuário administrador.
// Uso interativo:      npm run admin:create
// Uso não interativo:  ADMIN_NAME="..." ADMIN_EMAIL="..." ADMIN_PASSWORD="..." npm run admin:create
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function ask() {
  const rl = createInterface({ input: stdin, output: stdout });
  const name = (await rl.question("Nome completo: ")).trim();
  const email = (await rl.question("E-mail: ")).trim();
  stdout.write("Senha (mín. 10 caracteres, letras e números): ");
  // Oculta a senha digitada no terminal.
  const write = rl._writeToOutput;
  rl._writeToOutput = () => {};
  const password = await rl.question("");
  rl._writeToOutput = write;
  stdout.write("\n");
  rl.close();
  return { name, email, password };
}

const input = process.env.ADMIN_EMAIL
  ? { name: process.env.ADMIN_NAME ?? "Administrador", email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD ?? "" }
  : await ask();

const email = input.email.toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new Error("E-mail inválido.");
if (input.password.length < 10 || !/[a-zA-Z]/.test(input.password) || !/\d/.test(input.password)) {
  throw new Error("A senha deve ter pelo menos 10 caracteres, com letras e números.");
}

const passwordHash = await bcrypt.hash(input.password, 12);
const user = await db.user.upsert({
  where: { email },
  create: { name: input.name || "Administrador", email, passwordHash, role: "ADMIN" },
  update: { passwordHash, role: "ADMIN", active: true, sessionVersion: { increment: 1 } },
});
console.log(`\n✔ Administrador pronto: ${user.email}\n  Acesse /admin/login para entrar.`);
await db.$disconnect();
