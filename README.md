
1. install `deno`
2. Write this in whichever's mcp.json. (`deno` part might have to be absolute path)
  ```json
  {
    "mcpServers": {
      "my-mcp-server": {
        "command": "deno",
        "args": ["run", "-A", "path/to/your/server.ts"],
        "env": {},
        "disabled": false,
        "alwaysAllow": []
      }
    }
  }
  ```