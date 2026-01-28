import type { BookSummary } from "@/entities/book";

export type Filters = {
  author: string;
  difficulty: string;
  type: string;
  tag: string;
};

export const initialFilters: Filters = {
  author: "All",
  difficulty: "All",
  type: "All",
  tag: "All",
};

export type SortKey = "title";
export type SortDir = "asc" | "desc";

export type SortState = {
  key: SortKey;
  dir: SortDir;
};

export const initialSort: SortState = {
  key: "title",
  dir: "asc",
};

export type IndexedBook = {
  book: BookSummary;
  searchText: string;
};

export function buildSearchText(book: BookSummary) {
  return [
    book.title,
    book.author,
    book.type,
    book.difficulty,
    book.summary,
    ...(book.tags ?? []),
  ]
    .filter((v): v is string => Boolean(v))
    .join(" ")
    .toLowerCase();
}

export function matchesFilters(book: BookSummary, f: Filters) {
  if (f.author !== "All" && book.author !== f.author) return false;
  if (f.difficulty !== "All" && book.difficulty !== f.difficulty) return false;
  if (f.type !== "All" && book.type !== f.type) return false;

  if (f.tag !== "All") {
    const tags = book.tags ?? [];
    if (!tags.includes(f.tag)) return false;
  }

  return true;
}

export function filterAndSortBooks(args: {
  indexed: readonly IndexedBook[];
  query: string;
  filters: Filters;
  sort: SortState;
}) {
  const q = args.query.trim().toLowerCase();

  const filtered = args.indexed
    .filter(({ book, searchText }) => matchesFilters(book, args.filters) && (!q || searchText.includes(q)))
    .map(({ book }) => book);

  if (args.sort.key === "title") {
    filtered.sort((a, b) => {
      const aTitle = (a.title ?? a.path).toLowerCase();
      const bTitle = (b.title ?? b.path).toLowerCase();
      const res = aTitle.localeCompare(bTitle);
      return args.sort.dir === "asc" ? res : -res;
    });
  }

  return filtered;
}
