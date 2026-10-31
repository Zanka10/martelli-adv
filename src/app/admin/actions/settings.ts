"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireUser } from "@/lib/auth";
import { OFFICE_KEYS, SETTINGS_DEFAULTS, saveSettings, type SettingKey } from "@/lib/settings";
import { isAllowedImageUrl } from "@/lib/uploads";
import { onlyDigits } from "@/lib/format";
import type { FormState } from "./types";

const IMAGE_KEYS: SettingKey[] = ["logo", "heroImage", "officePhoto"];
const SOCIAL_KEYS: SettingKey[] = ["instagram", "facebook", "linkedin", "youtube"];

function validate(values: Partial<Record<SettingKey, string>>) {
  const errors: Record<string, string> = {};
  for (const [key, value] of Object.entries(values) as [SettingKey, string][]) {
    if (value.length > 20_000) errors[key] = "Texto muito longo.";
    if (IMAGE_KEYS.includes(key) && !isAllowedImageUrl(value)) errors[key] = "Imagem inválida.";
    if (SOCIAL_KEYS.includes(key) && value && !/^https:\/\/[^\s"'<>]+$/.test(value)) errors[key] = "Informe o endereço completo, começando com https://";
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) errors.email = "E-mail inválido.";
  if (values.whatsapp) {
    const d = onlyDigits(values.whatsapp);
    if (d.length < 10 || d.length > 13) errors.whatsapp = "Informe o número com DDD (ex.: (11) 91234-5678).";
  }
  if (values.phone && onlyDigits(values.phone).length < 10) errors.phone = "Informe o telefone com DDD.";
  if (values.mapEmbedUrl && !values.mapEmbedUrl.startsWith("https://www.google.com/maps/embed")) {
    errors.mapEmbedUrl = "Cole o endereço do mapa incorporado do Google Maps (começa com https://www.google.com/maps/embed).";
  }
  if ("officeName" in values && !values.officeName) errors.officeName = "Informe o nome do escritório.";
  return errors;
}

async function save(keys: SettingKey[], formData: FormData): Promise<FormState> {
  const values: Partial<Record<SettingKey, string>> = {};
  for (const key of keys) {
    const raw = formData.get(key);
    if (raw !== null) values[key] = String(raw).trim();
  }
  const fieldErrors = validate(values);
  if (Object.keys(fieldErrors).length) return { error: "Revise os campos destacados.", fieldErrors };
  await saveSettings(values);
  revalidatePath("/", "layout");
  return { ok: "Alterações salvas. O site já reflete as novas informações." };
}

export async function saveOfficeContent(_: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  return save(OFFICE_KEYS, formData);
}

export async function saveGeneralSettings(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const keys = (Object.keys(SETTINGS_DEFAULTS) as SettingKey[]).filter((k) => !OFFICE_KEYS.includes(k));
  return save(keys, formData);
}
