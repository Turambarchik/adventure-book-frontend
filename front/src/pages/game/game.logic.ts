import type { Book, Option, Section } from "@/entities/book";

export type SectionType = "BEGIN" | "END" | "NODE" | string;

function toIdString(value: unknown): string | null {
  if (typeof value === "string") {
    const v = value.trim();
    return v.length ? v : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

export function normalizeSectionType(type: Section["type"]) {
  return (type ?? "").trim().toUpperCase();
}

export function isBeginningSection(section: Section) {
  return normalizeSectionType(section.type) === "BEGIN";
}

export function isEndingSection(section: Section) {
  return normalizeSectionType(section.type) === "END";
}

export function indexSections(book: Book) {
  const map = new Map<string, Section>();

  for (const s of book.sections ?? []) {
    const id = toIdString((s as unknown as { id?: unknown }).id);
    if (id) map.set(id, s);
  }

  return map;
}

type ValidBook =
  | { ok: true; startId: string; reachableIds: Set<string> }
  | { ok: false; reason: string };

function getOptionGotoId(opt: Option): string | null {
  return toIdString((opt as unknown as { gotoId?: unknown }).gotoId);
}

/**
 * Validates only REACHABLE graph starting from the single BEGIN section.
 * Rules (Objective 2):
 * - Book has exactly one BEGIN section.
 * - Book has at least one END section reachable from BEGIN.
 * - Every reachable non-END section must have at least 1 option.
 * - Every option.gotoId from reachable sections must reference an existing section id.
 * Unreachable nodes are ignored (e.g. the sample "666" node).
 */
export function validateBookForGameplay(book: Book): ValidBook {
  const sections = book.sections ?? [];
  if (sections.length === 0) return { ok: false, reason: "Book has no sections." };

  const beginSections = sections.filter(isBeginningSection);
  if (beginSections.length === 0) return { ok: false, reason: "Book has no beginning section (BEGIN)." };
  if (beginSections.length > 1) return { ok: false, reason: "Book has more than one beginning section (BEGIN)." };

  const startId = toIdString((beginSections[0] as unknown as { id?: unknown }).id);
  if (!startId) return { ok: false, reason: "BEGIN section has invalid id." };

  const byId = indexSections(book);
  if (!byId.has(startId)) return { ok: false, reason: `Start section id "${startId}" not found in sections.` };

  // Reachability traversal (DFS)
  const reachableIds = new Set<string>();
  const stack: string[] = [startId];

  while (stack.length) {
    const id = stack.pop()!;
    if (reachableIds.has(id)) continue;

    const section = byId.get(id);
    if (!section) {
      // Should not happen because we only push ids that exist, but keep safe.
      continue;
    }

    reachableIds.add(id);

    const ending = isEndingSection(section);
    if (ending) continue;

    const options = (section.options ?? []) as Option[];
    for (const opt of options) {
      const gotoId = getOptionGotoId(opt);
      if (!gotoId) continue;
      if (byId.has(gotoId)) stack.push(gotoId);
    }
  }

  // Validate reachable graph rules
  let reachableEndCount = 0;

  for (const id of reachableIds) {
    const section = byId.get(id);
    if (!section) return { ok: false, reason: `Reachable section "${id}" is missing.` };

    const ending = isEndingSection(section);
    if (ending) {
      reachableEndCount += 1;
      continue;
    }

    const options = (section.options ?? []) as Option[];
    if (options.length === 0) {
      return { ok: false, reason: `Reachable non-ending section "${id}" has no options.` };
    }

    for (const opt of options) {
      const gotoId = getOptionGotoId(opt);
      if (!gotoId) return { ok: false, reason: `Option in section "${id}" has no gotoId.` };
      if (!byId.has(gotoId)) {
        return { ok: false, reason: `Invalid next section id "${gotoId}" from section "${id}".` };
      }
    }
  }

  if (reachableEndCount === 0) {
    return { ok: false, reason: "Book has no reachable ending section (END)." };
  }

  return { ok: true, startId, reachableIds };
}
