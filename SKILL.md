# Delora MCP — Guide for AI

Delora MCP exposes the Delora API (api.delora.build) so you can fetch cross-chain quotes, supported chains, tokens, and tools.

## Recommended order

1. **get_chains** — Get supported chain IDs and names.
2. **get_tokens** (or **get_token**) — Resolve token addresses and decimals per chain. Use `originCurrency` and `destinationCurrency` as contract addresses; use `0x0...` (or chain’s native zero address) for native currency.
3. **get_quote** — Get the best quote (output amount, calldata, gas, route).

Optional: **get_tools** for available tools/bridges; **get_instructions** (this guide) if you need the full workflow again.

## Formats

- **amount**: Always in **smallest units** (wei for 18-decimal tokens, raw units for others). Example: `"1000000000000000000"` for 1 ETH.
- **originCurrency / destinationCurrency**: Contract address of the token, or the chain’s native zero address (e.g. `0x0000000000000000000000000000000000000000` on EVM) for native asset.
- **Chain IDs**: Numbers. Examples: `1` (Ethereum), `42161` (Arbitrum), `137` (Polygon). Use **get_chains** to get the exact list.

## get_quote parameters

- Required: `originChainId`, `destinationChainId`, `amount`, `originCurrency`, `destinationCurrency`.
- Optional: `senderAddress`, `receiverAddress`, `integrator`, `fee` (0–0.1, only with integrator), `slippage` (0–1, e.g. 0.005 for 0.5%).

## What get_quote returns

The API returns the best quote, typically including:

- **outputAmount** (or similar) — Expected amount on destination chain.
- **calldata** / **transaction** — Data to sign and submit on the origin chain.
- **gas** / **estimatedGas** — Estimated gas on origin chain.
- Route/path and fee breakdown may be included; structure depends on api.delora.build.

Always pass through the raw JSON from the tool so the user (or the next step) can use calldata and amounts.

## Summary

Call **get_instructions** first if you need this guide. Then use **get_chains** → **get_tokens** / **get_token** → **get_quote** with amounts in smallest units and token addresses (or native zero).
