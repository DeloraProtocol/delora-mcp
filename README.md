# Delora MCP

MCP (Model Context Protocol) server for the [Delora](https://api.delora.build) API: cross-chain quotes, supported chains, tokens, and tools.

## Install

```bash
npm install
```

## Configuration

Copy `env.example` to `.env` and adjust:

| Variable | Description | Default |
|----------|-------------|---------|
| `DELORA_API_URL` | Delora API base URL | `https://api.delora.build` |
| `DELORA_API_KEY` | Optional API key forwarded to Delora API as `x-api-key` | unset |
| `MCP_TRANSPORT` | `stdio` or `http` | `stdio` |
| `PORT` | HTTP server port (when `MCP_TRANSPORT=http`) | `3000` |
| `HOST` | HTTP bind address | `0.0.0.0` |

When `DELORA_API_KEY` is set, the MCP server forwards it to Delora API as the `x-api-key` header. In HTTP mode, the server also accepts incoming `x-api-key` or `Authorization: Bearer ...` headers and forwards the resolved key upstream. For HTTP requests, incoming headers take priority over `DELORA_API_KEY`. For stdio, `DELORA_API_KEY` remains the way to provide the key.

## Run

**Stdio (default)** — for Cursor/IDE MCP over stdio:

```bash
npm run dev
# or
npm run build && npm start
```

**HTTP** — for streamable HTTP (e.g. behind a reverse proxy):

```bash
npm run dev:http
# or
npm run build && npm run start:http
```

Server listens on `http://0.0.0.0:3000/mcp`.

## Cursor configuration

**Stdio:**

```json
{
  "mcpServers": {
    "delora": {
      "command": "node",
      "args": ["/path/to/delora-mcp/dist/index.js"]
    }
  }
}
```

**Streamable HTTP** (e.g. after deploying to `https://mcp.delora.build`):

```json
{
  "mcpServers": {
    "delora": {
      "url": "https://mcp.delora.build/mcp",
      "transport": "streamable-http",
      "headers": {
        "x-api-key": "YOUR_API_KEY"
      }
    }
  }
}
```

You can also use `Authorization: Bearer YOUR_API_KEY` instead of `x-api-key` when your MCP client supports custom HTTP headers.

## Docker

Build and run:

```bash
docker build -t delora-mcp .
docker run -p 3000:3000 -e MCP_TRANSPORT=http delora-mcp
```

For production behind a domain (e.g. `mcp.delora.build`): run the container with `MCP_TRANSPORT=http` and put nginx/traefik (or another reverse proxy) in front with HTTPS; then use the URL `https://mcp.delora.build/mcp` with streamable-http in Cursor.

## API

- [Delora API](https://api.delora.build) — base URL for all `/v1/*` endpoints (quotes, chains, tokens, tools, token).

## Tools

| Tool | Description |
|------|-------------|
| `get_instructions` | Returns this guide (call first for workflow). |
| `get_quote` | GET /v1/quotes — cross-chain quote. |
| `get_chains` | GET /v1/chains — supported chains. |
| `get_tools` | GET /v1/tools — available tools. |
| `get_tokens` | GET /v1/tokens — supported tokens. |
| `get_token` | GET /v1/token — single token by chain + token. |
