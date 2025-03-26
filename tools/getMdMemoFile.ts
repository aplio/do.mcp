import { Tool } from "./types.ts";
import process from "node:process";

/**
 * Tool that gets a file with given markdown content and returns the filename and matched lines
 */
const getMdMemoFile: Tool = {
  name: "getMdMemoFile",
  description: "Get a file content and its metadata",
  inputSchema: {
    type: "object",
    properties: {
      title : { type: "string", description: "The title of the memo. This will be the filen name. It must match [a-zA-Z0-9_]+" },
    },
    required: ["title"],
  },

  // deno-lint-ignore no-explicit-any
  async execute(args: Record<string, any>): Promise<string> {
    const dir = process.env.MD_MEMO_DIR;
    if (!dir) {
      throw new Error("Environment variable MD_MEMO_DIR is not set")
    }
    const title = args.title;
    const path = `${dir}/${title}.md`;
    if (!Deno.statSync(path)) {
      throw new Error(`File not found: ${title}.md`);
    }

    const fileCotent = await Deno.readFile(path);
    const meta = await Deno.stat(path);
    return JSON.stringify({ title, meta, fileCotent });
  }
};

export default getMdMemoFile;