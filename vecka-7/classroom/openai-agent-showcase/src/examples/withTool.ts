import { run } from "@openai/agents";
import { travelHelper } from "../agents";

export async function runToolExample() {
	console.log("\nRunning Agent with Tool Example...");


	travelHelper.on("agent_start", (ctx, agent) => {
		console.log(`[${agent.name}] started`);
	});
	travelHelper.on("agent_end", (ctx, output) => {
		console.log(`[agent] produced:`, output);
	});

	travelHelper.on("agent_tool_start", (ctx, output) => {
		console.log(`[agent] started tool:`, output);
	});

	const result = await run(
		travelHelper,
		"What’s the weather like in Stockholm?",
		{ stream: true }
	);

	result
		.toTextStream({
			compatibleWithNodeStreams: true,
		})
		.pipe(process.stdout);

}
