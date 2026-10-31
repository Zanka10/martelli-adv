import {
  Baby,
  Briefcase,
  Building2,
  Calculator,
  Car,
  FileSignature,
  FileText,
  Gavel,
  HandCoins,
  HeartHandshake,
  Home,
  Landmark,
  Leaf,
  type LucideIcon,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  Users,
  Wheat,
} from "lucide-react";

export const AREA_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  Scale: { icon: Scale, label: "Balança" },
  Gavel: { icon: Gavel, label: "Martelo" },
  Landmark: { icon: Landmark, label: "Instituição" },
  Briefcase: { icon: Briefcase, label: "Pasta / Trabalho" },
  Building2: { icon: Building2, label: "Empresa" },
  Users: { icon: Users, label: "Pessoas / Família" },
  HeartHandshake: { icon: HeartHandshake, label: "Acordo / Mediação" },
  Home: { icon: Home, label: "Imóvel" },
  FileText: { icon: FileText, label: "Documento" },
  FileSignature: { icon: FileSignature, label: "Contrato" },
  ShieldCheck: { icon: ShieldCheck, label: "Proteção" },
  ShoppingBag: { icon: ShoppingBag, label: "Consumidor" },
  Calculator: { icon: Calculator, label: "Tributos / Cálculo" },
  HandCoins: { icon: HandCoins, label: "Previdência / Valores" },
  Stethoscope: { icon: Stethoscope, label: "Saúde" },
  Car: { icon: Car, label: "Trânsito" },
  Baby: { icon: Baby, label: "Infância" },
  Leaf: { icon: Leaf, label: "Ambiental" },
  Wheat: { icon: Wheat, label: "Agronegócio" },
};

export function AreaIcon({ name, className }: { name: string; className?: string }) {
  const Icon = AREA_ICONS[name]?.icon ?? Scale;
  return <Icon className={className} strokeWidth={1.4} aria-hidden />;
}
