import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { Mem0Memory } from "@langchain/community/memory/mem0";
import { randomUUID } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const sessionId = randomUUID();

const memory = new Mem0Memory({
	apiKey: process.env.MEM_API_KEY,
	sessionId,
	memoryOptions: {
		run_id: "run123", // Optional, if you want to save the conversation to a specific run.
	},
});

const model = new ChatOpenAI({
	modelName: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

//const chain = RunnableSequence.from([memory, model]);
const chain = new ConversationChain({ llm: model, memory });
console.log("Memory Keys:", memory.memoryKeys);

const res1 = await chain.invoke({
	input: "Hi! I am Joel and I like to play the guitar, and the piano!",
});
console.log({ res1 });

const res2 = await chain.invoke({ input: "What do I like to play?" });
console.log({ res2 });

const res3 = await chain.invoke({ input: "What do I do in my spare time?" });
console.log({ res3 });

console.log("Session ID: ", sessionId);
console.log("Memory: ", await memory.loadMemoryVariables({}));
