import type { Book, Option } from "@/entities/book";

export function toIdString(value: unknown): string | null {
  if (typeof value === "string") {
    const v = value.trim();
    return v.length ? v : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

export function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function getSectionIndex(sections: Book["sections"] | undefined, sectionId: string) {
  const list = sections ?? [];
  const idx = list.findIndex((s) => toIdString((s as unknown as { id?: unknown }).id) === sectionId);
  return idx >= 0 ? idx + 1 : null;
}

export function getConsequenceDeltaHp(opt: Option): number {
  const c = (opt as unknown as { consequence?: unknown }).consequence as
    | { type?: unknown; value?: unknown }
    | null
    | undefined;

  if (!c) return 0;

  const typeRaw = typeof c.type === "string" ? c.type.trim().toUpperCase() : "";
  const valueNum = toFiniteNumber(c.value) ?? 0;

  if (typeRaw === "LOSE_HEALTH") return -Math.abs(valueNum);
  if (typeRaw === "GAIN_HEALTH") return Math.abs(valueNum);
  if (typeRaw === "HEALTH") return valueNum;

  return 0;
}

export function clamp(min: number, value: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function getConsequenceText(opt: Option): string | null {
  const c = (opt as unknown as { consequence?: unknown }).consequence as { text?: unknown } | null | undefined;
  const t = c?.text;
  if (typeof t === "string") {
    const v = t.trim();
    return v.length ? v : null;
  }
  return null;
}
