import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph-checkpoint";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

const checkPointer = new MemorySaver();

const agent = createReactAgent({
	llm: model,
	tools: [],
	checkpointer: checkPointer,
	prompt:
		"You are a helpful assistant that can remember things about the user.",
});

const config = { configurable: { thread_id: "1" } };

async function main(prompt) {
	const message = [{ role: "user", content: prompt }];
	const result = await agent.invoke({ messages: message }, config);
	console.log(
		"Final response: " + result.messages[result.messages.length - 1].content
	);
}

async function run() {
	await main(
		"My name is Joel and I am a student at the University of Gothenburg."
	);
	await main("What is my name?");
}

run();
