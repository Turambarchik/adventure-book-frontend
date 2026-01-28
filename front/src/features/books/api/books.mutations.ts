import { useMutation } from "@tanstack/react-query";
import { saveBookProgress } from "./books.api";


export function useSaveBookProgressMutation() {
  return useMutation({
    mutationFn: (args: { bookPath: string; sectionNumber: number }) => saveBookProgress(args),
  });
}
