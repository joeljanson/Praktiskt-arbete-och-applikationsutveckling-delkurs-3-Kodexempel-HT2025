import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import dotenv from "dotenv";

dotenv.config();

async function main() {
	const model = new ChatOpenAI({
		model: "gpt-4o-mini",
		apiKey: process.env.OPENAI_API_KEY,
	});

	const geminiModel = new ChatGoogleGenerativeAI({
		model: "models/gemini-2.5-flash-lite",
		apiKey: process.env.GEMINI_API_KEY,
	});
/* 
	const response = await model.batch([
		"Tell me about birches. Very briefly!",
		"Tell me about oaks. Very briefly!",
		"Tell me about maples. Very briefly!",
	]); */
	//console.log(response);
	const response2 = await geminiModel.invoke(
		"Tell me about birches. Very briefly!"
	);

	//console.log("OpenAI response batch: ", response);
	console.log("Gemini response: ", response2.content);
}

main();
