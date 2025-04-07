# Hedera Testnet Mirror Node MCP Server

This repository contains a Model Context Protocol (MCP) server that interfaces with the Hedera Testnet Mirror Node API.
The server is built using [FastMCP](https://www.npmjs.com/package/fastmcp), a TypeScript framework for creating MCP servers.
It utilises [Zod](https://zod.dev/) schemas for input validation.

## Features

- **Endpoint Integration**: Automatically converts Hedera Mirror Node APIs, defined in OpenAPI specification format, into MCP-compatible tools.
- **Server-Sent Events (SSE) Support**: Clients cannot connect to this MCP server over the SSE transport.
- **Schema Validation**: Ensures request parameters adhere to defined schemas using Zod.

## Prerequisites

Before running the server, ensure you have the following installed:

- [Bun](https://bun.sh/), or any other environment capable of running Typescript directly.

## Installation

(1) Clone the repository

```bash
git clone https://github.com/hedera-dev/mirrornode-mcp-server
```

(2) Navigate to the project directory

```bash
cd mirrornode-mcp-server
```

(3) Install dependencies

```bash
npm install
```

## Usage

To start the MCP server:

```bash
bun mcpServer.ts
```

Upon successful startup, you should see:

```
MCP server started
```

The server will be accessible via the configured SSE endpoint.

`http://localhost:3333/hedera-testnet-mirror-node-api/sse`

## Project Structure

- `mcpServer.ts`: The entry point that initializes and starts the MCP server.
- `openApiZod.ts`: Contains Mirror Node API endpoint definitions and an API client using `zodios` (like `axios` augmented with `zod` schema definitions).
  - Note that this file has been programmatically generated using `openapi-zod-client` plus some manual modifications.

## How It Works

(1) API Client Creation

An API client is created for the Hedera Testnet Mirror Node using the `createApiClient` function.
The MCP server proxies between this HTTP API client and its own SSE transport.

(2) Endpoint Conversion:

Each endpoint definition from `endpointDefinitions` is processed by the `convertZodiosToMcp` function, which:
   - Validates that the endpoint uses the `GET` method.
   - Maps parameters to Zod schemas.
   - Defines an execution function that makes the corresponding API call and returns the result.
   - Registers the tool with the MCP server.

(3) Server Initialization:

The MCP server is started with SSE transport.

## Dependencies

- [FastMCP](https://www.npmjs.com/package/fastmcp): Framework for building MCP servers.
- [Zod](https://zod.dev/): TypeScript-first schema declaration and validation library.
- [openapi-zod-client](https://github.com/astahmer/openapi-zod-client): Generates Zodios code from an OpenAPI specification file.

## Author

[Brendan Graetz](https://blog.bguiz.com/)

## Licence

MIT
