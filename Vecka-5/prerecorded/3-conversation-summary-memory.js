import { ConversationSummaryMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { LLMChain } from "langchain/chains";

import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

const memory = new ConversationSummaryMemory({
	memoryKey: "chat_history",
	llm: model,
});

const prompt =
	PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
{chat_history}
Human: {input}
AI:`);


//const chainRunnableSequence = memory.pipe(prompt).pipe(model);

const chainRunnableSequence = new LLMChain({ llm: model, prompt, memory });

const res1 = await chainRunnableSequence.invoke({ input: "Hi! I'm Joel." });
console.log({ res1, memory: await memory.loadMemoryVariables({}) });

const res2 = await chainRunnableSequence.invoke({ input: "What's my name?" });
console.log({ res2, memory: await memory.loadMemoryVariables({}) });
