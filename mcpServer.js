#!/usr/bin/env bun

import { endpointDefinitions, createApiClient } from './openApiZod.ts';
import  { FastMCP } from 'fastmcp';
import { z } from 'zod';

const mcpServer = new FastMCP({
  name: 'hederaTestnetMirrorNodeApi',
  version: '0.0.0',
});

const zodiosApiClient = createApiClient('https://testnet.mirrornode.hedera.com', { validate: 'request' });
endpointDefinitions.forEach(convertZodiosToMcp);

mcpServer.start({
  transportType: 'sse',
  sse: {
    endpoint: '/hedera-testnet-mirror-node-api/sse',
    port: '3333',
  },
});

console.log('MCP server started');

function convertZodiosToMcp(endpoint) {
  const { method, alias, description, parameters } = endpoint;
  if (!method || method.toLowerCase() !== 'get') {
    return;
  }
  console.log('converting:', alias);
  const fastMcpParameters = {};
  parameters?.forEach((parameter) => {
    const { name, schema } = parameter;
    fastMcpParameters[name] = schema;
  });
  const fastMcpExecute = async function(inputs) {
    const params = {};
    const queries = {};
    parameters.forEach((parameter) => {
      const { name, type } = parameter;
      if (type && type.toLowerCase() === 'path') {
        params[name] = inputs[name];
      } else if (type && type.toLowerCase() === 'query') {
        queries[name] = inputs[name];
      }
    });
    const zodiosReq = { params, queries };
    console.log(alias, zodiosReq);
    const result = await zodiosApiClient[alias]({ params, queries });
    return JSON.stringify(result, undefined, 1);
  };
  const fastMcpTool = {
    name: alias,
    description,
    parameters: z.object(fastMcpParameters),
    execute: fastMcpExecute,
  };
  mcpServer.addTool(fastMcpTool);
}


/*
// Sample results of convertZodiosToMcp
// Input:
{
  method: "get",
  path: "/api/v1/accounts/:idOrAliasOrEvmAddress",
  alias: "getAccount",
  description: `Return the account transactions and balance information given an account alias, an account id, or an evm address. The information will be limited to at most 1000 token balances for the account as outlined in HIP-367.
When the timestamp parameter is supplied, we will return transactions and account state for the relevant timestamp query. Balance information will be accurate to within 15 minutes of the provided timestamp query.
Historical ethereum nonce information is currently not available and may not be the exact value at a provided timestamp.
`,
  requestFormat: "json",
  parameters: [
    {
      name: "idOrAliasOrEvmAddress",
      type: "Path",
      schema: z
        .string()
        .regex(
          /^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40}|(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8}))$/
        ),
    },
  ],
  response: AccountBalanceTransactions,
  errors: [
    {
      status: 400,
      description: `Invalid parameter`,
      schema: Error,
    },
    {
      status: 404,
      description: `Not Found`,
      schema: Error,
    },
  ],
}

// Output:
mcpServer.addTool({
  name: 'getAccount',
  description: getAccountDefinition.description,
  parameters: z.object({
    idOrAliasOrEvmAddress: getAccountDefinition.parameters[0].schema,
  }),
  execute: async function ({ idOrAliasOrEvmAddress }) {
    const result = await zodiosApiClient.getAccount({ params: { idOrAliasOrEvmAddress } });
    return JSON.stringify(result, undefined, 2);
  },
});
*/
