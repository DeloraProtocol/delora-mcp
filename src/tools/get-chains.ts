import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../api.js";

export function registerGetChains(server: McpServer): void {
  server.registerTool(
    "get_chains",
    {
      description: "List supported chains. Optionally filter by chainTypes (e.g. EVM,SOLANA).",
      inputSchema: {
        chainTypes: z
          .string()
          .optional()
          .describe("Comma-separated chain types, e.g. EVM,SOLANA"),
      },
    },
    async (params) => {
      const response = await apiGet("chains", {
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
