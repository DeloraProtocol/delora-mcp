import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiGet } from "../api.js";

export function registerGetChains(server: McpServer, apiGet: ApiGet): void {
  server.registerTool(
    "get_chains",
    {
      description: "List supported chains. Optionally filter by chainTypes (e.g. EVM,SVM).",
      inputSchema: {
        chainTypes: z
          .string()
          .optional()
          .describe("Comma-separated chain types, e.g. EVM,SVM"),
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
