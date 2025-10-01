import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function runGitTonejs(input: string) {
	const response = await client.responses.create({
		model: "gpt-5-nano",
		input:
			input,
		tools: [
			{
				type: "mcp",
				server_label: "gitmcp",
				server_url: "https://gitmcp.io/Tonejs/Tone.js",
				require_approval: "never",
			},
		],
	});

	console.log("\n--- GitMCP (tonejs) ---\n");
	console.log(JSON.stringify(response, null, 2));
}


async function main() {
	console.log("Running GitMCP (tonejs)");
	await runGitTonejs("Explain briefly how the transport works in tone.js. Cite the doc section you used.");
}

main();