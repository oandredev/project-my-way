import { formatDate } from "./studyItem";

export function normalizeSpaces(text) {
  return (text ?? "").trim().replace(/\s+/g, " ");
}

export function parseHours(text) {
  const clean = String(text ?? "")
    .trim()
    .replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) return NaN;
  return Number(clean);
}

// "31122026" -> "31/12/2026"
export function maskDate(text) {
  const digits = (text ?? "").replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseDateText(text) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((text ?? "").trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  const valid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return valid ? { day: match[1], month: match[2], year: match[3] } : null;
}

export function dateToIso(text) {
  const parsed = parseDateText(text);
  return parsed
    ? `${parsed.year}-${parsed.month}-${parsed.day}T12:00:00Z`
    : null;
}

export function itemToValues(item) {
  return {
    title: item?.title ?? "",
    institution: item?.institution ?? "",
    link: item?.link ?? "",
    notes: item?.notes ?? "",
    priority: item?.priority ?? "MEDIUM",
    totalHours: item ? String(item.totalHours ?? "") : "",
    doneHours: item ? String(item.doneHours ?? 0) : "0",
    deadline: formatDate(item?.deadline),
    categoryId: item?.categoryId ?? null,
  };
}

export function validateItemForm(values, isEditing) {
  const title = normalizeSpaces(values.title);
  if (!title) return "Digite o título.";
  if (title.length > 255) return "O título deve ter no máximo 255 caracteres.";

  const institution = normalizeSpaces(values.institution);
  if (!institution) return "Digite a instituição.";
  if (institution.length > 255) {
    return "A instituição deve ter no máximo 255 caracteres.";
  }

  if (!values.priority) return "Escolha a prioridade.";

  const total = parseHours(values.totalHours);
  if (Number.isNaN(total) || total <= 0) {
    return "Digite o total de horas (maior que 0).";
  }

  if (isEditing) {
    const done = parseHours(values.doneHours);
    if (Number.isNaN(done)) {
      return "Digite as horas feitas (use 0 se ainda não começou).";
    }
    if (done > total) return "As horas feitas não podem passar do total.";
  }

  if (values.deadline.trim() && !dateToIso(values.deadline)) {
    return "Digite o prazo no formato dd/mm/aaaa.";
  }

  const link = values.link.trim();
  if (link.length > 2048) return "O link deve ter no máximo 2048 caracteres.";
  if (link && !/^https?:\/\//i.test(link)) {
    return "O link deve começar com http:// ou https://.";
  }

  if (values.notes.trim().length > 2000) {
    return "As notas devem ter no máximo 2000 caracteres.";
  }

  return "";
}

export function buildItemPayload(values, isEditing, active = true) {
  const payload = {
    title: normalizeSpaces(values.title),
    institution: normalizeSpaces(values.institution),
    link: values.link.trim() || null,
    priority: values.priority,
    deadline: dateToIso(values.deadline),
    notes: values.notes.trim() || null,
    totalHours: parseHours(values.totalHours),
    categoryId: values.categoryId,
  };

  if (isEditing) {
    payload.doneHours = parseHours(values.doneHours);
    payload.active = active;
  }

  return payload;
}
