import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../api.js";

export function registerGetToken(server: McpServer): void {
  server.registerTool(
    "get_token",
    {
      description: "Get a single token by chain and token address/symbol.",
      inputSchema: {
        chain: z.string().describe("Chain ID or chain identifier"),
        token: z.string().describe("Token address or symbol"),
      },
    },
    async (params) => {
      const response = await apiGet("token", {
        chain: params.chain,
        token: params.token,
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
