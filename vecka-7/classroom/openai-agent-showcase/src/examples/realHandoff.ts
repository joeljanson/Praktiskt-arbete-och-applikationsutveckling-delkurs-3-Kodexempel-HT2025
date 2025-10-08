import { run } from "@openai/agents";
import { triageHandoffAgent } from "../agents";

export async function runRealHandoffExample() {
	console.log("Running Handoff Example...");

	let question = "What is the Pythagorean theorem?";
	console.log(`User Question: ${question}`);
	let result = await run(triageHandoffAgent, question);
	console.log("Agent Response:", result.finalOutput);

	question = "When did the Renaissance begin?";
	console.log(`User Question: ${question}`);
	result = await run(triageHandoffAgent, question);
	console.log("Agent Response:", result.finalOutput);
}
