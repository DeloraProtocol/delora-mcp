import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createApiGet } from "./api.js";
import { registerGetInstructions } from "./tools/get-instructions.js";
import { registerGetQuote } from "./tools/get-quote.js";
import { registerGetChains } from "./tools/get-chains.js";
import { registerGetTools } from "./tools/get-tools.js";
import { registerGetTokens } from "./tools/get-tokens.js";
import { registerGetToken } from "./tools/get-token.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillMd = readFileSync(resolve(__dirname, "../SKILL.md"), "utf-8");

export function createServer(options?: { apiKey?: string }): McpServer {
  const server = new McpServer({
    name: "delora-mcp",
    version: "0.1.3",
  });
  const apiGet = createApiGet(options);

  registerGetInstructions(server, skillMd);
  registerGetQuote(server, apiGet);
  registerGetChains(server, apiGet);
  registerGetTools(server, apiGet);
  registerGetTokens(server, apiGet);
  registerGetToken(server, apiGet);

  return server;
}
