import { http } from "@/shared/api/http";
import { BooksListSchema, bookSchema, type Book } from "@/entities/book";

export async function fetchBooks(signal?: AbortSignal) {
  return http({
    method: "GET",
    path: "/books",
    signal,
    parse: (data) => BooksListSchema.parse(data),
  });
}

export function getBook(args: { path: string; signal?: AbortSignal }): Promise<Book> {
  return http({
    method: "GET",
    path: `/books/${encodeURIComponent(args.path)}`,
    signal: args.signal,
    parse: (data) => bookSchema.parse(data),
  });
}

export function saveBookProgress(args: {
  bookPath: string;
  sectionNumber: number;
  signal?: AbortSignal;
}): Promise<void> {
  const book = encodeURIComponent(args.bookPath);
  const section = encodeURIComponent(String(args.sectionNumber));

  return http({
    method: "POST",
    path: `/books/progress/save?book=${book}&section=${section}`,
    signal: args.signal,
    parse: () => undefined,
  });
}
