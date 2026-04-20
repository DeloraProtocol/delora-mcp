export function getApiBaseUrl(): string {
  return process.env.DELORA_API_URL ?? "https://api.delora.build";
}

export function getApiKey(): string | undefined {
  const apiKey = process.env.DELORA_API_KEY?.trim();
  return apiKey ? apiKey : undefined;
}

export async function apiGet(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<{ ok: boolean; data: unknown; status: number }> {
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
  const apiKey = getApiKey();

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
}
