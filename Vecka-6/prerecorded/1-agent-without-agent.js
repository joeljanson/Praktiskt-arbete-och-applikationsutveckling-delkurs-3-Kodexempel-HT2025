import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
//Länk till zod: https://zod.dev/
//OpenAI om zod (förvisso med structured outputs men idén är densamma!): https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses
import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
});

const addTool = tool(
    async (a,b) => {
        return a + b;
    },
    {
        name: "add",
        description: "A function that adds a to b.",
        schema: z.object({
            a: z.number(),
            b: z.number(),
        }),
    }
);

const multiplyTool = tool(
    async (a,b) => {
        return a * b;
    },
    {
        name: "multiply",
        description: "A function that multiplies a by b.",
        schema: z.object({
            a: z.number(),
            b: z.number(),
        }),
    }
);

const toolsByName = {
    add: addTool,
    multiply: multiplyTool,
};

const tools = [addTool, multiplyTool];

const modelWithTools = model.bindTools(tools);

async function main() {
    const messages = [new HumanMessage("What is 3 * 12? And also, what is 11 + 49?")];
    const result = await modelWithTools.invoke(messages);
    messages.push(result);
    for (const toolCall of result.tool_calls) {
        const selectedTool = toolsByName[toolCall.name];
        const toolMessage = await selectedTool.invoke(toolCall);
        console.log(JSON.stringify(toolMessage, null, 2));
        messages.push(toolMessage);
    }

    const result2 = await modelWithTools.invoke(messages);
    //console.log(JSON.stringify(result2, null, 2));
}

main();
