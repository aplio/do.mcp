import { Tool } from "./types.ts";

/**
 * Tool that calculates the length of a string
 */
const getStringLength: Tool = {
  name: "getStringLength",
  description: "Get the length of a string",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "The input string" },
    },
    required: ["input"],
  },
  
  // deno-lint-ignore no-explicit-any require-await
  async execute(args: Record<string, any>): Promise<string> {
    const input = args.input;
    
    if (typeof input !== "string") {
      throw new Error(`Expected input to be a string, got ${typeof input}`);
    }
    
    // Correctly handles Unicode characters
    const length = Array.from(input).length;
    return String(length);
  }
};

export default getStringLength;
