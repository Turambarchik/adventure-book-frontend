import { useMemo, useState } from "react";

import { useBooksQuery } from "@/features/books/api/books.queries";
import { uniqueStrings } from "@/shared/lib/unique";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";

import {
  filterAndSortBooks,
  buildSearchText,
  initialFilters,
  initialSort,
  type Filters,
  type IndexedBook,
  type SortState,
} from "./homeBooks";
import { Chip, BookCard} from "./HomePage.components";



export function HomePage() {
  const { data, isLoading, error } = useBooksQuery();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sort, setSort] = useState<SortState>(initialSort);

  const debouncedSearch = useDebouncedValue(search, 200);

  const indexedBooks = useMemo<IndexedBook[]>(() => {
    return (data ?? []).map((book) => ({
      book,
      searchText: buildSearchText(book),
    }));
  }, [data]);

  const difficulties = useMemo(() => uniqueStrings(data?.map((b) => b.difficulty) ?? []), [data]);
  const types = useMemo(() => uniqueStrings(data?.map((b) => (b.type ?? undefined)) ?? []), [data]);
  const tags = useMemo(() => {
    const all = (data ?? []).flatMap((b) => b.tags ?? []);
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const filtered = useMemo(() => {
    return filterAndSortBooks({
      indexed: indexedBooks,
      query: debouncedSearch,
      filters,
      sort,
    });
  }, [indexedBooks, debouncedSearch, filters, sort]);

  const booksCount = filtered.length;

  const activeFiltersCount =
    (filters.author !== "All" ? 1 : 0) +
    (filters.difficulty !== "All" ? 1 : 0) +
    (filters.type !== "All" ? 1 : 0) +
    (filters.tag !== "All" ? 1 : 0);

  const topTypeChips = useMemo(() => types.filter(Boolean).slice(0, 4), [types]);
  const topTagChips = useMemo(() => tags.filter(Boolean).slice(0, 4), [tags]);

  function clearAll() {
    setSearch("");
    setFilters(initialFilters);
    setSort(initialSort);
  }

  return (
    <div className="min-h-screen bg-[#fbf7f0] text-zinc-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <section className="overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-b from-[#5b4a45] to-[#3f3330] shadow-[0_18px_50px_rgba(0,0,0,0.15)]">
          <div className="px-6 py-10 md:px-10">
            <div className="text-center">
              <div className="font-serif text-4xl font-bold tracking-tight text-amber-300 md:text-5xl">
                ✨ Adventure Awaits ✨
              </div>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-amber-50/90 md:text-base">
                Embark on epic quests where every choice shapes your destiny. Explore mystical realms, solve ancient
                mysteries, and become the hero of your own story.
              </p>

              <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-amber-200/30 bg-white/10 px-5 py-2 text-sm text-amber-50/90">
                <span aria-hidden="true">📚</span>
                <span className="font-medium">{(data ?? []).length} Epic Adventures Available</span>
                <span aria-hidden="true">✨</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-amber-100 bg-white/50 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="text-center">
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="text-2xl">
                📚
              </span>
              <h1 className="font-serif text-4xl font-bold tracking-tight text-zinc-900">The Adventure Library</h1>
            </div>

            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600 md:text-base">
              Choose your next adventure from our collection of interactive tales. Each book offers unique paths and
              multiple endings based on your choices.
            </p>

            <div className="mx-auto mt-7 w-full max-w-xl">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
                <input
                  className={[
                    "w-full rounded-2xl border border-amber-100 bg-[#f7efe3] px-11 py-3 text-sm",
                    "placeholder:text-zinc-500/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
                    "focus:outline-none focus:ring-2 focus:ring-amber-200/70",
                  ].join(" ")}
                  placeholder="Search adventures..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
                <div className="mr-2 inline-flex items-center gap-2 text-zinc-600">
                  <span aria-hidden="true">🔽</span>
                  <span>
                    Filters{activeFiltersCount ? ` (${activeFiltersCount})` : ""}:
                  </span>
                </div>

                {topTypeChips.map((v) => (
                  <Chip
                    key={`type-${v}`}
                    active={filters.type === v}
                    onClick={() => setFilters((prev) => ({ ...prev, type: prev.type === v ? "All" : v }))}
                  >
                    {v}
                  </Chip>
                ))}

                {topTagChips.map((v) => (
                  <Chip
                    key={`tag-${v}`}
                    active={filters.tag === v}
                    onClick={() => setFilters((prev) => ({ ...prev, tag: prev.tag === v ? "All" : v }))}
                  >
                    {v}
                  </Chip>
                ))}

                {difficulties
                  .filter(Boolean)
                  .slice(0, 3)
                  .map((v) => (
                    <Chip
                      key={`diff-${v}`}
                      active={filters.difficulty === v}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          difficulty: prev.difficulty === v ? "All" : v,
                        }))
                      }
                    >
                      {v}
                    </Chip>
                  ))}

                <button
                  type="button"
                  onClick={clearAll}
                  className="ml-2 rounded-full px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-white/70"
                >
                  Clear All
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3 text-sm text-zinc-600">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">📚</span>
                  <span>{isLoading ? "Loading…" : `${booksCount} book(s)`}</span>
                </span>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-amber-100 bg-white/70 p-4">
              <div className="font-semibold">Failed to load books</div>
              <div className="mt-1 text-sm text-zinc-700">
                {error instanceof Error ? error.message : "Unknown error"}
              </div>
            </div>
          ) : null}

          {!isLoading && !error && filtered.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-amber-100 bg-white/60 p-8 text-center text-sm text-zinc-700">
              No books match your search and filters.
            </div>
          ) : null}

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <BookCard key={b.path} book={b} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
