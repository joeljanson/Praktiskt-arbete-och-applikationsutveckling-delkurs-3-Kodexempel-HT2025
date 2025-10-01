import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";
import { TavilySearch } from "@langchain/tavily";
import dotenv from "dotenv";

dotenv.config();

const openai = new ChatOpenAI({
	modelName: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

const searchTool = new TavilySearch({ maxResults: 5 });

const tools = [searchTool];

const agent = createReactAgent({
	llm: openai,
	tools,
	prompt: `Today is ${new Date().toLocaleDateString()}. You are a helpful assistant that can search the web for information with a search tool.`,
});

async function main(prompt) {
	const handler = new ConsoleCallbackHandler();
	const agentOutput = await agent.invoke(
		{
			messages: [{ role: "user", content: prompt }],
		},
		{ callbacks: [handler] }
	);
	console.log(agentOutput.messages[agentOutput.messages.length - 1].content);
}

main("Could you tell me some positive news about today?");
