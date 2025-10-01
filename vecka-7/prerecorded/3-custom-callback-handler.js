import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import dotenv from "dotenv";

dotenv.config();

const openai = new ChatOpenAI({
	modelName: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

//What events can we use?
//https://js.langchain.com/docs/concepts/callbacks

async function main() {
	const customHandler = {
		handleChatModelStart: async (llm, inputMessages, runId) => {
			console.log("Chat model started", llm, inputMessages, runId);
		},
		handleLLMNewToken: async (token) => {
			console.log("New token", token);
		},
		handleLLMEnd: async (outputMessages, runId) => {
			console.log("Chat model ended", outputMessages, runId);
		},
	};

	const prompt = ChatPromptTemplate.fromMessages([
		("system", "You are a helpful assistant."),
		("user", "{input}"),
	]);

	const openAIChain = prompt.pipe(openai);

	const result = await openAIChain.stream(
		{
			input: "What is the capital of France?",
		},
		{ callbacks: [customHandler] }
	);

	for await (const chunk of result) {
		console.log(chunk);
	}
}

main();
