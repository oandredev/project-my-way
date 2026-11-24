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
