import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { StringOutputParser } from "@langchain/core/output_parsers";

import dotenv from "dotenv";
dotenv.config();
 
const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
});

const chatHistory = new InMemoryChatMessageHistory();

async function main(prompt) {
    await chatHistory.addMessage(new HumanMessage(prompt));
    const messages = await chatHistory.getMessages();
    const chain = model.pipe(new StringOutputParser());
    const response = await chain.invoke(messages);
    await chatHistory.addMessage(new AIMessage(response));
    return response;
}

console.log(await main("Hello, my name is Joel and I'm a software developer!"));
console.log(await main("What did I say my name was?"));