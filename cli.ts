#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env

import { parse } from "https://deno.land/std@0.221.0/flags/mod.ts";
import tools, { getToolDefinitions } from "./tools/index.ts";

// Get command line arguments
const args = parse(Deno.args, {
  string: ["tool", "args"],
  boolean: ["help", "list"],
  alias: {
    t: "tool",
    a: "args",
    h: "help",
    l: "list",
  },
});

// Format tool arguments nicely for display
function formatToolArguments(schema: Record<string, any>): string {
  if (!schema.properties) return "No arguments";
  
  const required = schema.required || [];
  const lines = Object.entries(schema.properties).map(([name, prop]: [string, any]) => {
    const isRequired = required.includes(name) ? "[required]" : "[optional]";
    return `  - ${name}: ${prop.description || "No description"} ${isRequired}`;
  });
  
  return lines.join("\n");
}

// Display help information
function showHelp() {
  console.log(`
MCP Tool Runner - Execute MCP tools from the command line

Usage:
  deno run --allow-net --allow-read --allow-write --allow-env cli.ts [options]

Options:
  -h, --help            Show this help message
  -l, --list            List all available tools
  -t, --tool [name]     Specify the tool to run
  -a, --args [json]     Tool arguments as JSON string

Examples:
  # List all available tools
  deno run --allow-net --allow-read --allow-write --allow-env cli.ts --list

  # Run getStringLength tool
  deno run --allow-net --allow-read --allow-write --allow-env cli.ts --tool getStringLength --args '{"input":"Hello, world!"}'

  # Run readUrl tool
  deno run --allow-net --allow-read --allow-write --allow-env cli.ts --tool readUrl --args '{"url":"https://example.com"}'
`);
}

// List all available tools
function listTools() {
  const toolDefs = getToolDefinitions();
  console.log("Available tools:\n");
  
  for (const tool of toolDefs) {
    console.log(`${tool.name}`);
    console.log(`  Description: ${tool.description}`);
    console.log(`  Arguments:`);
    console.log(formatToolArguments(tool.inputSchema));
    console.log();
  }
}

// Main function
async function main() {
  // Show help and exit
  if (args.help) {
    showHelp();
    return;
  }

  // List available tools and exit
  if (args.list) {
    listTools();
    return;
  }

  // Ensure a tool is specified
  if (!args.tool) {
    console.error("Error: No tool specified.");
    console.error("Use --list to see available tools or --help for usage information.");
    Deno.exit(1);
  }

  // Get the tool
  const toolName = args.tool;
  const tool = tools[toolName];
  if (!tool) {
    console.error(`Error: Tool '${toolName}' not found.`);
    console.error("Use --list to see available tools.");
    Deno.exit(1);
  }

  try {
    // Parse arguments
    let toolArgs = {};
    if (args.args) {
      try {
        toolArgs = JSON.parse(args.args);
      } catch (error) {
        console.error("Error parsing tool arguments:", error.message);
        console.error("Arguments must be a valid JSON string.");
        Deno.exit(1);
      }
    }

    // Execute the tool
    console.log(`Running tool: ${toolName}`);
    const result = await tool.execute(toolArgs);
    
    // Display the result
    if (typeof result === 'string') {
      console.log(result);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error(`Error executing tool '${toolName}':`, error.message);
    Deno.exit(1);
  }
}

// Run the main function
if (import.meta.main) {
  main();
}