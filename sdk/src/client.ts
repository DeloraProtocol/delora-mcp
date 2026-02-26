const DEFAULT_BASE_URL = "https://api.delora.build";

export interface QuoteParams {
  originChainId: number;
  destinationChainId: number;
  amount: string;
  originCurrency: string;
  destinationCurrency: string;
  senderAddress?: string;
  receiverAddress?: string;
  integrator?: string;
  fee?: number;
  slippage?: number;
}

export interface ChainsOptions {
  chainTypes?: string;
}

export interface ToolsOptions {
  chains?: string;
}

export interface TokensOptions {
  chains?: string;
  chainTypes?: string;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const q = search.toString();
  return q ? `?${q}` : "";
}

export class DeloraClient {
  constructor(public readonly baseUrl: string = DEFAULT_BASE_URL) {}

  private async get<T = unknown>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const base = this.baseUrl.replace(/\/$/, "");
    const url = `${base}/v1/${path.replace(/^\//, "")}${buildQuery(params ?? {})}`;
    const response = await fetch(url);
    return response.json() as Promise<T>;
  }

  getQuotes(params: QuoteParams): Promise<unknown> {
    return this.get("quotes", {
      originChainId: params.originChainId,
      destinationChainId: params.destinationChainId,
      amount: params.amount,
      originCurrency: params.originCurrency,
      destinationCurrency: params.destinationCurrency,
      senderAddress: params.senderAddress,
      receiverAddress: params.receiverAddress,
      integrator: params.integrator,
      fee: params.fee,
      slippage: params.slippage,
    });
  }

  getChains(options?: ChainsOptions): Promise<unknown> {
    return this.get("chains", { chainTypes: options?.chainTypes });
  }

  getTools(options?: ToolsOptions): Promise<unknown> {
    return this.get("tools", { chains: options?.chains });
  }

  getTokens(options?: TokensOptions): Promise<unknown> {
    return this.get("tokens", {
      chains: options?.chains,
      chainTypes: options?.chainTypes,
    });
  }

  getToken(chain: string, token: string): Promise<unknown> {
    return this.get("token", { chain, token });
  }
}

export function createClient(baseUrl?: string): DeloraClient {
  return new DeloraClient(baseUrl ?? DEFAULT_BASE_URL);
}
