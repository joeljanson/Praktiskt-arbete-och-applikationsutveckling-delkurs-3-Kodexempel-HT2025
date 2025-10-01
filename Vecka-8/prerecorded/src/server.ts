import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "mcp-time-server", version: "1.0.0" });

server.registerTool(
	"time_now",
	{
		title: "Get the current time",
		description: "Gets the current time",
		inputSchema: { tz: z.string().optional() },
	},
	async ({ tz }) => {
		const now = tz
			? new Date().toLocaleString("sv-SE", { timeZone: tz })
			: new Date().toLocaleString("sv-SE");
		return { content: [{ type: "text", text: String(now) }] };
	}
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.log("Server is running on stdin/stdout");