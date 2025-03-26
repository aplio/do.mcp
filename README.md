# Modular MCP Server
1. install `deno`
2. Write this in whichever's mcp.json. (`deno` part might have to be absolute path)
  ```json
  {
    "mcpServers": {
      "my-mcp-server": {
        "command": "deno",
        "args": ["run", "-A", "path/to/your/server.ts"],
        "env": {
          "MD_MEMO_DIR": "path/to/your/memo/dir"
        },
        "disabled": false,
        "alwaysAllow": []
      }
    }
  }
  ```

This is a modular implementation of a Model Context Protocol (MCP) server that makes it easy to add new tools and functionality.

## Project Structure

```
/
├── src/
│   ├── server.ts           # Main server setup and initialization
│   ├── tools/              # Directory for all tool implementations
│   │   ├── index.ts        # Exports and registers all tools
│   │   ├── types.ts        # Common types for tools
│   │   ├── getStringLength.ts 
│   │   ├── readUrl.ts      
│   │   └── ... (your tools here)
│   └── utils/              # Shared utility functions
│       └── extractContent.ts
```

## How to Run

```bash
deno run --allow-net src/server.ts
```

## Adding a New Tool

To add a new tool to the server, follow these steps:

1. Create a new file in the `src/tools/` directory (e.g., `myNewTool.ts`)
2. Implement the Tool interface from `types.ts`
3. Add your tool to the toolsList array in `src/tools/index.ts`

### Tool Template

```typescript
import { Tool } from "./types.ts";

const myNewTool: Tool = {
  name: "myNewTool",
  description: "Description of what your tool does",
  inputSchema: {
    type: "object",
    properties: {
      // Define the parameters your tool accepts
      param1: { type: "string", description: "Description of parameter 1" },
      // Add more parameters as needed
    },
    required: ["param1"], // List required parameters
  },
  
  async execute(args: Record<string, any>): Promise<string | object> {
    // Validate inputs
    const param1 = args.param1;
    if (typeof param1 !== "string") {
      throw new Error(`Expected param1 to be a string, got ${typeof param1}`);
    }
    
    // Implement your tool's logic here
    const result = `Processed: ${param1}`;
    
    // Return a string or object that will be converted to JSON
    return result;
  }
};

export default myNewTool;
```

### Registering Your Tool

After creating your tool file, add it to `src/tools/index.ts`:

```typescript
import { Tool } from "./types.ts";

// Import all tools
import getStringLength from "./getStringLength.ts";
import readUrl from "./readUrl.ts";
import myNewTool from "./myNewTool.ts"; // Add your import here

// Register all tools here
const toolsList: Tool[] = [
  getStringLength,
  readUrl,
  myNewTool, // Add your tool here
];

// Rest of the file...
```

That's it! Your tool will now be automatically available through the MCP server.