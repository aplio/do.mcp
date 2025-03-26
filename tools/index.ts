import { Tool } from "./types.ts";

// Import all tools
import getStringLength from "./getStringLength.ts";
import readUrl from "./readUrl.ts";

// Register all tools here
// When adding a new tool, just import it above and add it to this array
const toolsList: Tool[] = [
  getStringLength,
  readUrl,
  // Add more tools here
];

// Convert to a map for easier lookup
const tools: Record<string, Tool> = {};
for (const tool of toolsList) {
  tools[tool.name] = tool;
}

// Utility function to get tool definitions for MCP
export function getToolDefinitions() {
  return toolsList.map(tool => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));
}

export default tools;