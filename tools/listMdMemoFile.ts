import { Tool } from "./types.ts";
import process from "node:process";

/**
 * Tool that lists all the files in the memo directory
 */
const listMdMemoFile: Tool = {
  name: "listMdMemoFile",
  description: "List all the files in the memo directory",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },

  // deno-lint-ignore no-explicit-any require-await
  async execute(_: Record<string, any>): Promise<string> {
    const dir = process.env.MD_MEMO_DIR;
    if (!dir) {
      throw new Error("Environment variable MD_MEMO_DIR is not set")
    }
    const files = Deno.readDirSync(dir);
    const results = [];
    for (const file of files) {
      results.push(file.name);
    }
    return JSON.stringify(results, null, 2);
  }
};

export default listMdMemoFile;