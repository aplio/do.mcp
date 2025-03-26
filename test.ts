import { Client } from "npm:@modelcontextprotocol/sdk@1.5.0/client/index.js";
import { InMemoryTransport } from "npm:@modelcontextprotocol/sdk@1.5.0/inMemory.js";
import server from "./server.ts";

async function testServer() {
  // Create a client
  const client = new Client(
    {
      name: "test-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  // Create and connect transports
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([
    client.connect(clientTransport),
    server.connect(serverTransport),
  ]);

  try {
    // Test getStringLength
    console.log("Testing getStringLength...");
    const lengthResult = await client.callTool({
      name: "getStringLength",
      arguments: {
        input: "Hello, world!",
      },
    });
    console.log("String length result:", lengthResult);

    // Test readUrl
    console.log("\nTesting readUrl...");
    const urlResult = await client.callTool({
      name: "readUrl",
      arguments: {
        url: "https://example.com",
      },
    });
    console.log("URL content (first 100 chars):", 
      // @ts-ignore unsafe
      urlResult.content && urlResult.content[0]?.text?.substring(0, 100) + "...");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close connections
    await Promise.all([
      client.close(),
      server.close(),
    ]);
  }
}

testServer();