import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiGet } from "../api.js";

export function registerGetTokens(server: McpServer, apiGet: ApiGet): void {
  server.registerTool(
    "get_tokens",
    {
      description: "List supported tokens. Optionally filter by chains and/or chainTypes.",
      inputSchema: {
        chains: z.string().optional().describe("Comma-separated chain IDs or identifiers"),
        chainTypes: z.string().optional().describe("Chain types, e.g. EVM,SVM"),
      },
    },
    async (params) => {
      const response = await apiGet("tokens", {
        chains: params.chains,
        chainTypes: params.chainTypes,
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
