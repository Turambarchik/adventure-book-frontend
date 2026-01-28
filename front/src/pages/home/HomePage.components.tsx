
import { Link } from "react-router-dom";

import type { BookSummary } from "@/entities/book";

export function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        "shadow-[0_1px_0_rgba(0,0,0,0.03)]",
        active
          ? "border-amber-200 bg-amber-200/70 text-zinc-900"
          : "border-amber-200/70 bg-white/60 text-zinc-800 hover:bg-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function Badge({
  variant,
  children,
}: {
  variant: "difficulty" | "type" | "tag";
  children: React.ReactNode;
}) {
  const base = "rounded-full border px-2 py-0.5 text-[11px] font-medium leading-5";
  const cls =
    variant === "difficulty"
      ? "border-amber-200 bg-amber-100/60 text-zinc-800"
      : variant === "type"
        ? "border-emerald-200 bg-emerald-100/60 text-zinc-800"
        : "border-zinc-200 bg-zinc-100/70 text-zinc-700";

  return <span className={[base, cls].join(" ")}>{children}</span>;
}

export function BookCard({ book }: { book: BookSummary }) {
  const title = book.title ?? book.path;
  const author = book.author ?? "Unknown author";

  const difficulty = (book.difficulty ?? "").trim();
  const type = (book.type ?? "").trim();

  const duration = (book as unknown as { duration?: unknown }).duration;
  const chapters = (book as unknown as { chapters?: unknown }).chapters;

  const durationText = typeof duration === "string" && duration.trim() ? duration.trim() : null;
  const chaptersNum = typeof chapters === "number" && Number.isFinite(chapters) ? chapters : null;

  return (
    <div className="rounded-2xl border border-amber-100 bg-white/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="font-serif text-2xl font-semibold tracking-tight text-zinc-900">{title}</div>

      <div className="mt-1 text-sm text-zinc-600">
        <span>by {author}</span>
      </div>

      <div className="mt-4 min-h-[72px] text-sm leading-relaxed text-zinc-700">
        {book.summary ? <p className="line-clamp-4">{book.summary}</p> : <p className="opacity-70">No summary provided.</p>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {difficulty ? <Badge variant="difficulty">{difficulty}</Badge> : null}
        {type ? <Badge variant="type">{type}</Badge> : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-600">
        {durationText ? (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true">🕔</span>
            <span>{durationText}</span>
          </span>
        ) : null}

        {typeof chaptersNum === "number" ? (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true">📖</span>
            <span>{chaptersNum} chapters</span>
          </span>
        ) : null}
      </div>

      {book.tags && book.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {book.tags.slice(0, 4).map((t) => (
            <Badge key={t} variant="tag">
              {t}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="mt-6">
        <Link
          className={[
            "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3",
            "bg-gradient-to-b from-amber-400 to-amber-600 text-sm font-semibold text-white",
            "shadow-[0_10px_20px_rgba(245,158,11,0.25)] transition hover:brightness-105 active:brightness-95",
          ].join(" ")}
          to={`/play/${encodeURIComponent(book.path)}`}
        >
          <span aria-hidden="true">✨</span>
          <span>Begin Quest</span>
        </Link>
      </div>
    </div>
  );
}
