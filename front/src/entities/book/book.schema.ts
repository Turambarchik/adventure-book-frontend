import { z } from "zod";

/**
 * Backend contract for GET /books (BookSummary in OpenAPI).
 * `path` is the unique identifier used to load a book via GET /books/{path}.
 */
export const BookSummarySchema = z
  .object({
    path: z.string(),
    title: z.string().optional(),
    author: z.string().optional(),
    difficulty: z.string().optional(),
    type: z.string().nullable().optional(),
    duration: z.string().optional(),
    chapters: z.number().int().optional(),
    tags: z.array(z.string()).optional(),
    summary: z.string().optional(),
  })
  .passthrough();

export type BookSummary = z.infer<typeof BookSummarySchema>;

export const BooksListSchema = z.array(BookSummarySchema);
export type BooksList = z.infer<typeof BooksListSchema>;

// ---- Book (full) ----

export const consequenceSchema = z
  .object({
    type: z.string().optional(),
    value: z.string().optional(),
    text: z.string().optional(),
  })
  .nullable()
  .optional();

export const optionSchema = z.object({
  description: z.string().optional(),
  gotoId: z.string().optional(),
  consequence: consequenceSchema,
});

export const sectionSchema = z.object({
  id: z.string(),
  text: z.string().optional(),
  type: z.string().nullable().optional(),
  options: z.array(optionSchema).nullable().optional(),
});

export const bookSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  difficulty: z.string().optional(),
  type: z.string().nullable().optional(),
  sections: z.array(sectionSchema).nullable().optional(),
});

export type Book = z.infer<typeof bookSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Option = z.infer<typeof optionSchema>;
