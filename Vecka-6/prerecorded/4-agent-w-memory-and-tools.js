import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph-checkpoint";
import dotenv from "dotenv";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

dotenv.config();

const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

const checkPointer = new MemorySaver();

const magicTool = tool(
	async (object) => {
		console.log(JSON.stringify(object, null, 2));
		const parsedInput = parseInt(object.input);
		if (isNaN(parsedInput)) {
			return `${object.input} is really magic!`;
		}
		return `${parsedInput + 2}`;
	},
	{
		name: "magic_function",
		description: "Applies a magic function to an input",
		schema: z.object({
			input: z.string(),
		}),
	}
);

const tools = [magicTool];


const agent = createReactAgent({
	llm: model,
	tools,
	checkpointer: checkPointer,
	prompt:
		`You are a helpful assistant that can remember things about the user.`,
});

const config = { configurable: { thread_id: "1" }, streamMode: "values" };

async function main(prompt) {
	const message = [{ role: "user", content: prompt }];
	const stream = await agent.stream({ messages: message }, config);

	for await (const { messages } of stream) {
		let msg = messages[messages?.length - 1];
		if (msg?.content) {
			console.log(msg.content);
		} else if (msg?.tool_calls?.length > 0) {
			console.log(msg.tool_calls);
		} else {
			console.log(msg);
		}
		console.log("-----\n");
	}

	/* console.log(
		"Final response: " + result.messages[result.messages.length - 1].content
	); */
}

async function run() {
	await main(
		"My name is Joel and I am a student at the University of Gothenburg."
	);
	await main("What is my name?");
	await main(
		"At university, they asked what sending in 5 to the magic function would do. What would I get?"
	);
	await main("But I can't input my name right?? Would you like to try?");
}

run();
