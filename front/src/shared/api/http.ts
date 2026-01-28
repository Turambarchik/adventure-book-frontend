import { env } from "@/shared/config/env";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class HttpError extends Error {
  public readonly status: number;
  public readonly url: string;
  public readonly bodyText?: string;

  constructor(args: { status: number; url: string; bodyText?: string }) {
    super(`HTTP ${args.status} for ${args.url}`);
    this.status = args.status;
    this.url = args.url;
    this.bodyText = args.bodyText;
  }
}

/**
 * Builds the request path with an optional API prefix.
 * When env indicated same-origin (empty base URL), we must return a relative path.
 */
function buildPath(prefix: string, path: string) {
  const normalizedPrefix = prefix ? `/${prefix.replace(/^\/+|\/+$/g, "")}` : "";
  const normalizedPath = `/${path.replace(/^\/+/, "")}`;
  return `${normalizedPrefix}${normalizedPath}`;
}

/**
 * Builds the absolute or relative URL depending on env.apiBaseUrl:
 * - If base URL is provided: absolute URL (e.g. http://localhost:8080/service/books)
 * - If base URL is empty: same-origin URL (e.g. http://localhost:5173/service/books) for Vite proxy
 */
function buildUrl(pathWithPrefix: string) {
  if (env.apiBaseUrl) {
    const normalizedBase = env.apiBaseUrl.replace(/\/+$/, "");
    return new URL(`${normalizedBase}${pathWithPrefix}`);
  }

  return new URL(pathWithPrefix, window.location.origin);
}

export async function http<T>(args: {
  method: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  parse: (data: unknown) => T;
}): Promise<T> {
  const pathWithPrefix = buildPath(env.apiPrefix, args.path);
  const url = buildUrl(pathWithPrefix);

  if (args.query) {
    for (const [key, value] of Object.entries(args.query)) {
      if (value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {
    ...(args.body === undefined ? {} : { "Content-Type": "application/json" }),
    ...(args.headers ?? {}),
  };

  const response = await fetch(url.toString(), {
    method: args.method,
    headers,
    body: args.body === undefined ? undefined : JSON.stringify(args.body),
    signal: args.signal,
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => undefined);
    throw new HttpError({ status: response.status, url: url.toString(), bodyText });
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data =
    contentType.includes("application/json") ? await response.json() : await response.text();

  return args.parse(data);
}
