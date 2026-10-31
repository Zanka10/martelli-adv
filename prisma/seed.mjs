// Conteúdo inicial EDITÁVEL. As áreas abaixo são apenas exemplos para estruturar o site:
// revise, edite, desative ou exclua pelo painel até que os serviços reais sejam confirmados.
// Não são criados integrantes da equipe, depoimentos, números ou qualificações.
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const areas = [
  {
    title: "Direito Civil",
    icon: "Scale",
    summary: "Orientação e atuação em questões contratuais, obrigações, responsabilidade civil e conflitos entre particulares.",
    situations: "Elaboração e revisão de contratos\nCobranças e execuções\nIndenizações por danos materiais e morais\nQuestões possessórias e de propriedade",
  },
  {
    title: "Direito de Família e Sucessões",
    icon: "Users",
    summary: "Condução cuidadosa de questões familiares e patrimoniais, priorizando o diálogo e soluções consensuais quando possível.",
    situations: "Divórcio e dissolução de união estável\nGuarda e convivência\nPensão alimentícia\nInventário e partilha\nPlanejamento sucessório",
  },
  {
    title: "Direito do Trabalho",
    icon: "Briefcase",
    summary: "Assessoria em relações de trabalho, prevenção de riscos e atuação em reclamações trabalhistas.",
    situations: "Verbas rescisórias\nHoras extras e jornada\nAcordos trabalhistas\nConsultoria preventiva para empresas",
  },
  {
    title: "Direito Empresarial",
    icon: "Building2",
    summary: "Suporte jurídico para empresas, da constituição às rotinas contratuais e societárias.",
    situations: "Constituição e alteração de sociedades\nAcordos de sócios\nContratos empresariais\nAssessoria jurídica contínua",
  },
  {
    title: "Direito do Consumidor",
    icon: "ShoppingBag",
    summary: "Defesa de direitos nas relações de consumo, com análise de cada caso e busca da solução adequada.",
    situations: "Cobranças indevidas\nNegativação indevida\nProdutos e serviços com defeito\nCancelamento de contratos",
  },
  {
    title: "Direito Imobiliário",
    icon: "Home",
    summary: "Segurança jurídica em negociações, contratos e regularizações envolvendo imóveis.",
    situations: "Compra e venda de imóveis\nLocação e ações de despejo\nUsucapião\nRegularização de imóveis",
  },
];

for (const [i, a] of areas.entries()) {
  const slug = a.title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  await db.practiceArea.upsert({
    where: { slug },
    update: {},
    create: {
      ...a,
      slug,
      order: i,
      description: `<p>${a.summary}</p><p>Texto de exemplo: substitua pela descrição detalhada do serviço prestado pelo escritório.</p>`,
      complementary: "Cada caso é analisado individualmente. Os honorários são definidos após a avaliação da demanda.",
    },
  });
}

for (const name of ["Artigos", "Notícias", "Orientações"]) {
  const slug = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  await db.category.upsert({ where: { slug }, update: {}, create: { name, slug } });
}

console.log(`✔ Conteúdo inicial criado: ${areas.length} áreas de exemplo e 3 categorias.`);
await db.$disconnect();
