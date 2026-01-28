import { useQuery } from "@tanstack/react-query";
import { fetchBooks, getBook } from "./books.api";

export const booksQueryKey = ["books"] as const;

export function useBooksQuery() {
  return useQuery({
    queryKey: booksQueryKey,
    queryFn: ({ signal }) => fetchBooks(signal),
  });
}

export function useBookQuery(bookPath: string | undefined) {
  return useQuery({
    queryKey: ["books", "byPath", bookPath] as const,
    enabled: Boolean(bookPath),
    queryFn: ({ signal }) => {
      if (!bookPath) throw new Error("Missing book path.");
      return getBook({ path: bookPath, signal });
    },
  });
}
