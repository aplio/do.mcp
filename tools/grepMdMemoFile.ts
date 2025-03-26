import { Tool } from "./types.ts";
import process from "node:process";

/**
 * Tool that greps a file with given markdown content and returns the filename and matched lines
 */
const grepMdMemoFile: Tool = {
  name: "grepMdMemoFile",
  description: "Grep a file with given markdown content and returns the filename and matched lines",
  inputSchema: {
    type: "object",
    properties: {
      pattern : { type: "string", description: "The pattern to search" },
      include_n_lines_surrounding: { type: "number", description: "The number of lines surrounding the matched line to include", default: 0 },
    },
    required: ["title", "url"],
  },

  // deno-lint-ignore no-explicit-any require-await
  async execute(args: Record<string, any>): Promise<string> {
    const dir = process.env.MD_MEMO_DIR;
    if (!dir) {
      throw new Error("Environment variable MD_MEMO_DIR is not set")
    }
    const pattern = args.pattern;
    const files = Deno.readDirSync(dir);
    const results = [];
    for (const file of files) {
      if (file.isFile && file.name.endsWith('.md')) {
        const data = Deno.readTextFileSync(`${dir}/${file.name}`);
        const lines = data.split('\n');
        const matchedLines = [];
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(pattern)) {
            const start = Math.max(0, i - args.include_n_lines_surrounding);
            const end = Math.min(lines.length, i + args.include_n_lines_surrounding + 1);
            matchedLines.push({
              line: i,
              content: lines.slice(start, end).join('\n'),
            });
          }
        }
        if (matchedLines.length > 0) {
          results.push({
            file: file.name,
            matchedLines,
          });
        }
      }
    }
    return JSON.stringify(results, null, 2);
  }
};

export default grepMdMemoFile;