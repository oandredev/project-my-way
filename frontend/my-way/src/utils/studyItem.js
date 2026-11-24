export const PRIORITY_LABELS = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

export const STATUS_LABELS = {
  TODO: "A fazer",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluído",
};

//--------------------------------------------------------------

export function normalizeText(text) {
  return (text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getProgress(item) {
  const total = Number(item.totalHours) || 0;
  const done = Number(item.doneHours) || 0;
  if (total <= 0) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

export function summarize(items) {
  const totalHours = items.reduce(
    (sum, i) => sum + (Number(i.totalHours) || 0),
    0,
  );
  const doneHours = items.reduce(
    (sum, i) => sum + (Number(i.doneHours) || 0),
    0,
  );

  return {
    total: items.length,
    inProgress: items.filter((i) => i.status === "IN_PROGRESS").length,
    done: items.filter((i) => i.status === "DONE").length,
    totalHours,
    doneHours,
    percent:
      totalHours > 0
        ? Math.min(100, Math.round((doneHours / totalHours) * 100))
        : 0,
  };
}

// "2026-12-31T12:00:00Z" -> "31/12/2026"
export function formatDate(iso) {
  if (!iso) return "";
  const [year, month, day] = String(iso).slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : "";
}

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const HOURS_STEP = 1;

export function deriveStatus(doneHours, totalHours) {
  if (doneHours <= 0) return "TODO";
  if (doneHours >= totalHours) return "DONE";
  return "IN_PROGRESS";
}

export function adjustHours(doneHours, totalHours, delta) {
  const next = Math.round((doneHours + delta) * 100) / 100;
  return Math.min(totalHours, Math.max(0, next));
}

//--------------------------------------------------------------

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toLocalDay(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getDaysUntil(deadline) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((toLocalDay(deadline) - today) / MS_PER_DAY);
}

export function formatDaysUntil(days) {
  if (days === 0) return "hoje";
  if (days === 1) return "amanhã";
  if (days === -1) return "venceu ontem";
  if (days < 0) return `atrasado há ${-days} dias`;
  return `daqui ${days} dias`;
}
