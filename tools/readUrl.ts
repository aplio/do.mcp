import { Tool } from "./types.ts";
import { extractContent } from "../utils/extractContent.ts";

/**
 * Tool that reads a URL and extracts the main content as Markdown
 */
const readUrl: Tool = {
  name: "readUrl",
  description: "Read a URL and extract the main content as Markdown",
  inputSchema: {
    type: "object",
    properties: {
      url: { type: "string", description: "The URL to read" },
    },
    required: ["url"],
  },

  // deno-lint-ignore no-explicit-any
  async execute(args: Record<string, any>): Promise<string> {
    const url = args.url;
    
    if (typeof url !== "string") {
      throw new Error(`Expected url to be a string, got ${typeof url}`);
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.text();
    return extractContent(data);
  }
};

export default readUrl;