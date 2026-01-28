const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
const apiPrefix = (import.meta.env.VITE_API_PREFIX as string | undefined) ?? "";

export const env = {
  apiBaseUrl,
  apiPrefix,
} as const;
