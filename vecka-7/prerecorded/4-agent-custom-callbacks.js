import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";
import { TavilySearch } from "@langchain/tavily";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";

const searchTool = new DuckDuckGoSearch({ maxResults: 1 });
import dotenv from "dotenv";

dotenv.config();

const openai = new ChatOpenAI({
	modelName: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

const tavilySearchTool = new TavilySearch({ maxResults: 5 });

const tools = [searchTool, tavilySearchTool];

const agent = createReactAgent({
	llm: openai,
	tools,
	prompt: `Today is ${new Date().toLocaleDateString()}. You are a helpful assistant that can search the web for information with two search tools, one for duckduckgo and one for tavily. If one doesn't work, try the other, always start with duckduckgo.`,
});

async function main(prompt) {
	const customHandler = {
		handleToolStart: async (tool, input) => {
			console.log("Tool started", tool, input);
		},
		handleToolError: async () => {
			console.log("Error");
		},
		handleToolEnd: async (output) => {
			console.log("Tool ended", output);
			/* console.log(
				`Found information from ${output.results.length} sources. Looking through. Will soon get back to you!`
			); */
		},
	};
	const agentOutput = await agent.invoke(
		{
			messages: [{ role: "user", content: prompt }],
		},
		{ callbacks: [customHandler] }
	);
	console.log(agentOutput.messages[agentOutput.messages.length - 1].content);
}

main("What happens in stockholm today?");
