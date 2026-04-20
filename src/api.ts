export function getApiBaseUrl(): string {
  return process.env.DELORA_API_URL ?? "https://api.delora.build";
}

export function getApiKey(): string | undefined {
  const apiKey = process.env.DELORA_API_KEY?.trim();
  return apiKey ? apiKey : undefined;
}

export type ApiGet = (
  path: string,
  params?: Record<string, string | number | undefined>,
) => Promise<{ ok: boolean; data: unknown; status: number }>;

type HeaderValue = string | string[] | undefined;

function getFirstHeaderValue(value: HeaderValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0]?.trim() || undefined;
  }

  return typeof value === "string" ? value.trim() || undefined : undefined;
}

function normalizeApiKey(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function extractApiKeyFromHeaders(
  headers: Record<string, HeaderValue>,
): string | undefined {
  const directKey = getFirstHeaderValue(headers["x-api-key"] ?? headers["x-api_key"]);
  if (directKey) {
    return normalizeApiKey(directKey);
  }

  const authorization = getFirstHeaderValue(
    headers["authorization"] ?? headers["Authorization"],
  );

  if (!authorization) {
    return undefined;
  }

  const bearerMatch = authorization.match(/^Bearer\s+(.+)$/i);
  return normalizeApiKey(bearerMatch ? bearerMatch[1] : authorization);
}

export function createApiGet(options?: { apiKey?: string }): ApiGet {
  const requestApiKey = normalizeApiKey(options?.apiKey);

  return async (
    path: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<{ ok: boolean; data: unknown; status: number }> => {
    const base = getApiBaseUrl().replace(/\/$/, "");
    const url = new URL(`${base}/v1/${path.replace(/^\//, "")}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers = new Headers();
    const apiKey = requestApiKey ?? getApiKey();

    if (apiKey) {
      headers.set("x-api-key", apiKey);
    }

    const response = await fetch(url.toString(), { headers });
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = { message: await response.text() };
    }

    return {
      ok: response.ok,
      data,
      status: response.status,
    };
  };
}

export async function apiGet(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<{ ok: boolean; data: unknown; status: number }> {
  return createApiGet()(path, params);
}
