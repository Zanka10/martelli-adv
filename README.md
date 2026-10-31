# Martelli Advogados e Associados — site institucional

Site público e painel administrativo (`/admin`) em **Next.js 15**, **Prisma** (SQLite) e **Tailwind CSS 4**.

## Primeiros passos

```bash
npm install
cp .env.example .env        # preencha AUTH_SECRET (instruções no arquivo)
npx prisma migrate deploy   # cria o banco
npm run db:seed             # áreas de atuação de EXEMPLO e categorias
npm run admin:create        # cria o primeiro administrador (interativo)
npm run dev                 # http://localhost:3000  ·  painel em /admin
```

Produção: `npm run build && npm start`.

## Primeiro acesso ao painel

1. **Configurações** → cadastre o **WhatsApp comercial**. Ele é obrigatório para o formulário de orçamento.
   Cadastre também telefone, e-mail, endereço, horários e redes sociais. O que ficar vazio não aparece no site.
2. **O Escritório** → história, missão, visão, valores e foto institucional.
3. **Áreas de atuação** → as 6 áreas criadas pelo seed são **apenas exemplos**. Edite, desative ou exclua.
4. **Equipe** → cadastre os integrantes. O número da OAB só aparece no site se "Inscrição conferida" estiver marcada.
5. **Usuários** → crie acessos de *Editor* (conteúdo) ou *Administrador* (acesso total).

O site não exibe números, anos de experiência, depoimentos nem qualificações que não tenham sido cadastrados.

## Funcionalidades

- **Solicitar orçamento**: formulário em 3 etapas com validação, resumo e envio pelo WhatsApp (`wa.me`) para o número configurado.
  Os dados não são gravados no servidor.
- **Publicações**: rascunho, publicação imediata, agendamento (entra no ar sozinho na data), despublicar, excluir, editor rico,
  imagem de capa, categorias, autores, pré-visualização, busca, filtros, paginação, compartilhamento, SEO (metadados,
  Open Graph, JSON-LD, sitemap, robots).
- **Contato**: formulário salvo no banco e listado em *Mensagens* no painel (com proteção anti-spam).
- **Segurança**: senhas com bcrypt, sessão em cookie httpOnly assinado, sessões invalidadas na troca de senha, limite de tentativas
  de login, recuperação de senha por e-mail com token de uso único (1 h), papéis Administrador/Editor, HTML sanitizado,
  uploads validados pelo conteúdo do arquivo.

## Hospedagem — pontos de atenção

- **E-mail**: configure as variáveis `SMTP_*` para a recuperação de senha funcionar. Em desenvolvimento, sem SMTP, o link aparece no console.
- **Imagens enviadas** ficam na pasta `uploads/` e o **banco SQLite** fica em `prisma/dev.db`. Use um servidor com disco persistente
  (VPS, Railway, Render com disco etc.) e inclua ambos no backup. Em plataformas serverless (ex.: Vercel), troque para PostgreSQL
  (`provider` em `prisma/schema.prisma`) e para um armazenamento de arquivos externo.
- Defina `SITE_URL` com o domínio final (usado no sitemap, nos links compartilhados e na recuperação de senha).
