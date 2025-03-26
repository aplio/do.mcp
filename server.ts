import { Server } from "npm:@modelcontextprotocol/sdk@1.5.0/server/index.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.5.0/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  CallToolRequest
} from "npm:@modelcontextprotocol/sdk@1.5.0/types.js";
import { JSDOM } from "npm:jsdom@26.0.0";
import { Readability } from "npm:@mozilla/readability";
import html2md from "npm:html-to-md";

// Function to extract content from HTML
function getExtractContent(htmlContent: string) {
  const doc = new JSDOM(htmlContent);
  const article = new Readability(doc.window.document).parse();
  if (!article) {
    throw new Error("Article not found");
  }
  //@ts-ignore unsafe
  return html2md(article.content || "");
}

// Define your tools
const TOOLS = [
  {
    name: "getStringLength",
    description: "Get the length of a string",
    inputSchema: {
      type: "object",
      properties: {
        input: { type: "string", description: "The input string" },
      },
      required: ["input"],
    },
  },
  {
    name: "readUrl",
    description: "Read a URL and extract the main content as Markdown",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "The URL to read" },
      },
      required: ["url"],
    },
  },
];

// Create the server
const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {
        getStringLength: TOOLS[0],
        readUrl: TOOLS[1],
      },
    },
  }
);

// Set up handlers
server.setRequestHandler(ListResourcesRequestSchema, () => ({
  resources: [],
}));

server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const name = request.params.name;
  const args = request.params.arguments ?? {};
  
  try {
    switch (name) {
      case "getStringLength": {
        const input = args.input as string;
        if (typeof input !== "string") {
          throw new Error(`Expected input to be a string, got ${typeof input}`);
        }
        const length = Array.from(input).length; // Correctly handles Unicode characters
        return {
          content: [
            {
              type: "text",
              text: String(length),
            },
          ],
          isError: false,
        };
      }
      case "readUrl": {
        const url = args.url as string;
        if (typeof url !== "string") {
          throw new Error(`Expected url to be a string, got ${typeof url}`);
        }
        const data = await fetch(url).then((res) => res.text());
        const md = getExtractContent(data);
        return {
          content: [
            {
              type: "text",
              text: md,
            },
          ],
          isError: false,
        };
      }
      default: {
        throw new Error(`Unknown tool: ${name}`);
      }
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: error instanceof Error ? error.message : String(error),
        },
      ],
      isError: true,
    };
  }
});

// Start the server if this is the main module
if (import.meta.main) {
  await server.connect(new StdioServerTransport());
  console.error("MCP server running on stdio");
}

export default server;