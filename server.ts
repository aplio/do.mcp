import { Server } from "npm:@modelcontextprotocol/sdk@1.5.0/server/index.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.5.0/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  CallToolRequest
} from "npm:@modelcontextprotocol/sdk@1.5.0/types.js";

import tools, { getToolDefinitions } from "./tools/index.ts";
import { ToolResponse } from "./tools/types.ts";

/**
 * Create and configure the MCP server
 */
function createServer() {
  // Create server instance
  const server = new Server(
    {
      name: "my-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        resources: {},
        tools: Object.fromEntries(
          getToolDefinitions().map(tool => [tool.name, tool])
        ),
      },
    }
  );

  // Set up handlers
  server.setRequestHandler(ListResourcesRequestSchema, () => ({
    resources: [],
  }));

  server.setRequestHandler(ListToolsRequestSchema, () => ({ 
    tools: getToolDefinitions()
  }));

  // @ts-ignore unsafe
  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const name = request.params.name;
    const args = request.params.arguments ?? {};
    
    try {
      // Get the requested tool
      const tool = tools[name];
      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }
      
      // Execute the tool
      const result = await tool.execute(args);
      
      // Format the response
      return formatResponse(result);
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

  return server;
}

/**
 * Format a successful tool response
 */
function formatResponse(result: string | object): ToolResponse {
  const text = typeof result === 'string' 
    ? result 
    : JSON.stringify(result, null, 2);
  
  return {
    content: [{ type: "text", text }],
    isError: false,
  };
}

/**
 * Format an error response
 */
function formatErrorResponse(error: unknown): ToolResponse {
  const message = error instanceof Error 
    ? error.message 
    : String(error);
  
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}

// Create the server
const server = createServer();

// Start the server if this is the main module
if (import.meta.main) {
  await server.connect(new StdioServerTransport());
  console.error("MCP server running on stdio");
}

export default server;