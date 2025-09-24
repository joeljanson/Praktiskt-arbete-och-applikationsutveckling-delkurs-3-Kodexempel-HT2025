import { ChatOpenAI } from "@langchain/openai";
import { FileSystemChatMessageHistory } from "@langchain/community/stores/message/file_system";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";

import dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	temperature: 0,
	apiKey: process.env.OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
	("system",
	"You are a helpful assistant that can answer questions and help with tasks."),
	new MessagesPlaceholder("chat_history"),
	("user", "{input}"),
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

const chainWithHistory = new RunnableWithMessageHistory({
	runnable: chain,
	inputMessagesKey: "input",
	historyMessagesKey: "chat_history",
	getMessageHistory: async (sessionId) => {
		const chatHistory = new FileSystemChatMessageHistory({
			sessionId,
			userId: "user1234",
		});
		return chatHistory;
	},
});

async function main(prompt) {
	const response = await chainWithHistory.invoke(
		{
			input: prompt,
		},
		{ configurable: { sessionId: "1234" } }
	);
	return response;
}

//console.log(await main("Hello, my name is Joel and I'm a software developer!"));
//console.log(await main("What did I say my name was?"));
console.log(
	await main(
		"I'm thinking about a job as a programmer, would I be suitable for it?"
	)
);
