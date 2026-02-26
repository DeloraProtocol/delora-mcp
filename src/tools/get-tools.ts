import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../api.js";

export function registerGetTools(server: McpServer): void {
  server.registerTool(
    "get_tools",
    {
      description: "List available tools (e.g. bridges, DEXes). Optionally filter by chains (comma-separated).",
      inputSchema: {
        chains: z
          .string()
          .optional()
          .describe("Comma-separated chain IDs or identifiers"),
      },
    },
    async (params) => {
      const response = await apiGet("tools", {
        chains: params.chains,
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
