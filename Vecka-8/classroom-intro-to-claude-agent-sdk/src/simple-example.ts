import { query } from "@anthropic-ai/claude-agent-sdk";


async function simpleExample() {
	console.log("Starting Claude Agent SDK example...");

	for await (const message of query({
		prompt:
			"What's the current pricing in the claude api, look at this url to find out: https://www.claude.com/pricing#api",
		options: {
			maxTurns: 5,
		},
	})) {
		switch (message.type) {
			case "assistant":
				console.log("🤖 Assistant:", message.message.content);
				break;

			case "result":
				console.log("✅ Query completed!");
				console.log(`   Turns: ${message.num_turns}`);
				console.log(`   Cost: $${message.total_cost_usd}`);
				console.log(`   Success: ${!message.is_error}`);
				break;

			case "system":
				console.log("⚙️  System:", message);
				break;

			default:
				break;
		}
	}
}

async function streamingExample() {
	console.log("\nStarting streaming example...");

	async function* generateMessages() {
		yield {
			type: "user" as const,
			session_id: "streaming-session",
			message: {
				role: "user" as const,
				content: "Help me understand this codebase structure",
			},
			parent_tool_use_id: null,
		};
	}

	for await (const message of query({
		prompt: generateMessages(),
		options: {
			maxTurns: 15,
			allowedTools: ["Read", "Grep", "List"],
		},
	})) {
		if (message.type === "assistant") {
			console.log("🤖 Assistant response:", message.message.content);
		} else if (message.type === "result") {
			console.log("✅ Streaming query completed!");
			console.log(`   Final turns: ${message.num_turns}`);
			console.log(`   Cost: $${message.total_cost_usd}`);
			console.log(`   Success: ${!message.is_error}`);
		}
	}
}

async function main() {
	try {
		await simpleExample();
		//await streamingExample();
	} catch (error) {
		console.error("Error running examples:", error);
	}
}

// Uncomment to run the examples
main();
