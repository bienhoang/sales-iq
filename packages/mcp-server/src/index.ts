import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { loadConfig } from './config.js';

import { crmToolDefinitions, handleCrmTool } from './tools/crm.js';
import { emailToolDefinitions, handleEmailTool } from './tools/email.js';
import { socialToolDefinitions, handleSocialTool } from './tools/social.js';
import { analyticsToolDefinitions, handleAnalyticsTool } from './tools/analytics.js';
import { leadScoringToolDefinitions, handleLeadScoringTool } from './tools/lead-scoring.js';
import { contentCalendarToolDefinitions, handleContentCalendarTool } from './tools/content-calendar.js';

import { pipelineResourceDefinitions, handlePipelineResource } from './resources/pipeline.js';
import { campaignsResourceDefinitions, handleCampaignsResource } from './resources/campaigns.js';
import { contactsResourceDefinitions, handleContactsResource } from './resources/contacts.js';

import { campaignLaunchPromptDefinition, getCampaignLaunchPrompt } from './prompts/campaign-launch.js';
import { leadNurturePromptDefinition, getLeadNurturePrompt } from './prompts/lead-nurture.js';

const config = loadConfig();

const server = new Server(
  { name: 'sales-iq', version: '0.1.0' },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  },
);

// --- Tools ---

const allToolDefinitions = [
  ...crmToolDefinitions,
  ...emailToolDefinitions,
  ...socialToolDefinitions,
  ...analyticsToolDefinitions,
  ...leadScoringToolDefinitions,
  ...contentCalendarToolDefinitions,
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allToolDefinitions,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const safeArgs = args as Record<string, unknown>;

  const handlers = [
    handleCrmTool,
    handleEmailTool,
    handleSocialTool,
    handleAnalyticsTool,
    handleLeadScoringTool,
    handleContentCalendarTool,
  ];

  for (const handler of handlers) {
    const result = await handler(name, safeArgs, config);
    if (result !== null) {
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  }

  return {
    content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${name}` }) }],
    isError: true,
  };
});

// --- Resources ---

const allResourceDefinitions = [
  ...pipelineResourceDefinitions,
  ...campaignsResourceDefinitions,
  ...contactsResourceDefinitions,
];

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: allResourceDefinitions,
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  const resourceHandlers = [
    handlePipelineResource,
    handleCampaignsResource,
    handleContactsResource,
  ];

  for (const handler of resourceHandlers) {
    const result = await handler(uri, config);
    if (result !== null) {
      return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(result, null, 2) }] };
    }
  }

  return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify({ error: `Unknown resource: ${uri}` }) }] };
});

// --- Prompts ---

const allPromptDefinitions = [
  campaignLaunchPromptDefinition,
  leadNurturePromptDefinition,
];

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: allPromptDefinitions,
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const safeArgs = args as Record<string, string>;

  if (name === 'campaign_launch') {
    return { messages: [{ role: 'user', content: { type: 'text', text: getCampaignLaunchPrompt(safeArgs) } }] };
  }

  if (name === 'lead_nurture') {
    return { messages: [{ role: 'user', content: { type: 'text', text: getLeadNurturePrompt(safeArgs) } }] };
  }

  throw new Error(`Unknown prompt: ${name}`);
});

// --- Start ---

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write('sales-iq MCP server running on stdio\n');
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${err}\n`);
  process.exit(1);
});
