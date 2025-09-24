import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "openai";
const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

//En sökväg till en fil som kan användas för att lagra minnet.
const MEMORY_FILE = "./memory_bank.json";
/* 
const exampleFunctionSchema = {
	type: "function",
	name: "functionName",
	description: "Description of the function",
	parameters: {
		type: "object",
		properties: {
			property1: {
				type: "string",
				description: "Description of property1",
			},
		},
		additionalProperties: false,
	},
	strict: true, // If true, the function schema must be followed exactly. If false, the function schema is used as a guide.
}; */

// Uppgift här är att skriva en schema för en funktion som kan användas för att lägga till en text i minnet.
//Få hjälp att skriva ett schema med hjälp av exampleFunctionSchema ovan eller OpenAIs schema generator.
//Se: https://platform.openai.com/docs/guides/function-calling?api-mode=responses#:~:text=Take%20a%20look%20at%20this%20example%20or%20generate,Generate
const addToMemorySchema = {
	type: "function",
	name: "addToMemory",
	description: `When the user tells you something factual about themselves,
    their life or their preferences, call this function.
    
    Keep the memory text short and concise. Always refer to the user as "this user"`,
	parameters: {
		type: "object",
		properties: {
			memoryText: {
				type: "string",
				description: "The text to add to the memory",
			},
			memoryType: {
				type: "string",
				description: "The category of the memory",
			},
			expires: {
				type: "boolean",
				description: "Whether the memory should expire or not.",
			},
		},
		required: ["memoryText", "memoryType", "expires"],
		additionalProperties: false,
	},
	strict: true,
};


async function chatWithMemory(prompt) {
	const memory = getMemory();
	try {
		//Vi behöver lägga till någonting här som vi skickar in till responses.create - vad kan det vara?
		//Se: https://platform.openai.com/docs/guides/function-calling?api-mode=responses
		//Kan vi instruera modellen att inte använda markdown? Eller parsa markdownen på något sätt? Kan vi be den skriva kortare svar?
		const response = await client.responses.create({
			model: "gpt-5-nano",
            instructions: "The information you have about this user is: " + memory,
			input: prompt,
			tools: [addToMemorySchema],
			stream: false,
		});

		console.log(JSON.stringify(response, null, 2));

		for (const item of response.output) {
			if (item.type !== "function_call") {
				console.log("Not a function call");
				console.log(item);
				continue;
			}

			const name = item.name;
			const args = JSON.parse(item.arguments);

			if (name === "addToMemory") {
				// dispatch to your real function
				await addToMemory(args.memoryText, args.memoryType, args.expires);
				console.log("Added to memory:", args.memoryText);
			}
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

let memoryBank = [];

async function loadMemory() {
	try {
		memoryBank = JSON.parse(await fs.readFile(MEMORY_FILE, "utf8"));
	} catch {
		memoryBank = [];
	}
}
async function saveMemory() {
	await fs.writeFile(MEMORY_FILE, JSON.stringify(memoryBank, null, 2));
}

export async function addToMemory(memoryText, memoryType, expires = false) {
	memoryBank.push({ text: memoryText, type: memoryType, expires: expires });
	await saveMemory();
}

export function getMemory() {
	return memoryBank.map((m) => m.text + " (" + m.type + ")").join("\n");
	//return memoryBank.map((m) => m.text).join("\n");
}

/* ---------- main ---------- */
async function main() {
	await loadMemory();
	//await chatWithMemory("I am a software developer and I live in Stockholm. I like being in nature and I like to travel.");
	//await chatWithMemory("Who am I?");
	//await chatWithMemory("My name is Joel and I also like music.");
	//await chatWithMemory("I'm working on a javascript project where I want to build a sampler using tone.js");
    //await chatWithMemory("I have two kids and a dog.");
    //await chatWithMemory("I don't have a dog, it's actually a cat.");
    //await chatWithMemory("I had a really good day at work today. I created a database with semantic search.");
    await chatWithMemory("Do I have a dog or a cat?");

}

main();
