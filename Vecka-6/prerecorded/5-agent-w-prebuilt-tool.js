import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { WebBrowser } from "langchain/tools/webbrowser";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

dotenv.config();

import { TavilySearch } from "@langchain/tavily";


const searchTool = new TavilySearch({
	maxResults: 5,
	topic: "general",
	// includeAnswer: false,
	// includeRawContent: false,
	// includeImages: false,
	// includeImageDescriptions: false,
	// searchDepth: "basic",
	// timeRange: "day",
	// includeDomains: [],
	// excludeDomains: [],
});

const wikipediaTool = new WikipediaQueryRun({
	topKResults: 3,
	maxDocContentLength: 10000,
});

dotenv.config();

const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

const embeddings = new OpenAIEmbeddings({
	apiKey: process.env.OPENAI_API_KEY,
});

const webBrowserTool = new WebBrowser({ llm:model, embeddings });

const tools = [searchTool];

const agent = createReactAgent({
	llm: model,
	tools,
	prompt: "You are a helpful assistant that can browse the web and answer questions.",
});

async function main(prompt) {
	const stream = await agent.stream({ messages: [{ role: "user", content: prompt }] }, { streamMode: "values" });

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
    //console.log("The result of the agent is: ", result.messages[result.messages.length - 1].content);
}

async function run() {  
	//await main("What can you tell me about Tokyo? Please check wikipedia for the information.");
    await main(
			"What is the weather in Tokyo?"
		);
}

run();