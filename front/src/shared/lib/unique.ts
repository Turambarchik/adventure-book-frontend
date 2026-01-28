export function uniqueStrings(values: readonly (string | undefined)[]) {
  return Array.from(new Set(values.filter((v): v is string => Boolean(v)))).sort((a, b) =>
    a.localeCompare(b),
  );
}
