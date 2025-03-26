import { Tool } from "./types.ts";
import process from "node:process";

/**
 * Tool that saves a file with given markdown content
 */
const saveMdMemoFile: Tool = {
  name: "saveMdMemoFile",
  description: "Save a file with given markdown content",
  inputSchema: {
    type: "object",
    properties: {
      title : { type: "string", description: "The title of the memo. This will be the filen name. It must match [a-zA-Z0-9_]+" },
      url: { type: "string", description: "The markdown content to save" },
    },
    required: ["title", "url"],
  },

  // deno-lint-ignore no-explicit-any
  async execute(args: Record<string, any>): Promise<string> {
    const title = args.title;
    const url = args.url;
    
    if (typeof title !== "string") {
      throw new Error(`Expected title to be a string, got ${typeof title}`);
    }
    if (typeof url !== "string") {
      throw new Error(`Expected url to be a string, got ${typeof url}`);
    }
    
    const encoder = new TextEncoder();
    const data = encoder.encode(url);

    const dir = process.env.MD_MEMO_DIR;
    if (!dir) {
      throw new Error("Environment variable MD_MEMO_DIR is not set")
    }
    Deno.mkdir(dir, { recursive: true });
    await Deno.writeFile(`${process.env.MD_MEMO_DIR}/${title}.md`, data);
    
    return `File saved: ${title}.md`;
  }
};

export default saveMdMemoFile;