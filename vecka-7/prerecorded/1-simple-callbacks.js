import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import dotenv from "dotenv";

dotenv.config();

const openai = new ChatOpenAI({
	modelName: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
	const handler = new ConsoleCallbackHandler();

	const prompt = ChatPromptTemplate.fromMessages([
		("system", "You are a helpful assistant."),
		("user", "{input}"),
	]);

	const openAIChain = prompt.pipe(openai).pipe(new StringOutputParser());

	const result = await openAIChain.invoke(
		{
			input: "What is the capital of France?",
		},
		{ callbacks: [handler] }
	);
	console.log(result.content);
}

main();
