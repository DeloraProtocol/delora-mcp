import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiGet } from "../api.js";

const quoteSchema = {
  originChainId: z.number().describe("Origin chain ID (e.g. 1 for Ethereum, 42161 for Arbitrum)"),
  destinationChainId: z.number().describe("Destination chain ID"),
  amount: z.string().describe("Amount in smallest units (wei/smallest decimals)"),
  originCurrency: z.string().describe("Token address on origin chain; use 0x0... for native currency"),
  destinationCurrency: z.string().describe("Token address on destination chain; use 0x0... for native"),
  senderAddress: z.string().optional().describe("Sender wallet address"),
  receiverAddress: z.string().optional().describe("Receiver wallet address"),
  integrator: z.string().optional().describe("Integrator identifier"),
  fee: z.number().min(0).max(0.1).optional().describe("Fee 0–0.1 (only with integrator)"),
  slippage: z.number().min(0).max(1).optional().describe("Slippage tolerance 0–1 (e.g. 0.005 for 0.5%)"),
};

export function registerGetQuote(server: McpServer, apiGet: ApiGet): void {
  server.registerTool(
    "get_quote",
    {
      description: "Get a cross-chain quote: best route, output amount, calldata, gas. Use get_chains and get_tokens first to resolve chain IDs and token addresses.",
      inputSchema: quoteSchema,
    },
    async (params) => {
      const response = await apiGet("quotes", {
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

      if (!response.ok) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: (response.data as { message?: string })?.message ?? response.data,
                statusCode: response.status,
              }),
            },
          ],
        };
      }

      return {
        content: [{ type: "text" as const, text: JSON.stringify(response.data) }],
      };
    },
  );
}
