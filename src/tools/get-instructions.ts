import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetInstructions(
  server: McpServer,
  skillMd: string,
): void {
  server.registerTool(
    "get_instructions",
    {
      description:
        "CALL THIS FIRST. Returns the guide for Delora MCP: how to get quotes, chains, tokens, tools…",
    },
    () => ({
      content: [{ type: "text" as const, text: skillMd }],
    }),
  );
}
