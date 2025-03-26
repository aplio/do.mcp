// Tool definition interface
export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    // deno-lint-ignore no-explicit-any
    properties: Record<string, any>;
    required: string[];
  };
  // deno-lint-ignore no-explicit-any
  execute(args: Record<string, any>): Promise<string | object>;
}

// Response format for tool execution
export interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError: boolean;
}
