import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

const magicTool = tool(
    async (object) => {
        console.log(JSON.stringify(object, null, 2));
        return `${object.input + 2}`;
    },
    {
        name: "magic_function",
        description: "Applies a magic function to an input",
        schema: z.object({
            input: z.number(),
        })
    }
)

const tools = [magicTool];

const agent = createReactAgent({
    llm: model,
    tools,
});

const messages = [{ role: "system", content: "You are a helpful assistant that can use the magic function to answer questions." }];

async function main(prompt) {
    messages.push({ role: "user", content: prompt });
    const result = await agent.invoke({
        messages: messages,
    });
    messages.push(result.messages[result.messages.length - 1]);
    console.log("Final response: " + result.messages[result.messages.length - 1].content);
}

async function run() {
    await main("What is 2 if you run it through the magic function?");
    await main("Why do you think that is? What does the magic function do?");
}

run();