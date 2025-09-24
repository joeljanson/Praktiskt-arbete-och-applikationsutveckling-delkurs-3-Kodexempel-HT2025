import { OpenAI } from "openai";

import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

let history = [];
let currentSummary = "";
async function dynamicConversationExample(prompt) {
	history.push({ role: "user", content: prompt });
	const dynamicResponse = await client.responses.create({
		model: "gpt-4o-mini",
		instructions:
			"You are a helpful assistant that can answer questions and help with tasks. Here is the previous summary of this conversation (might be empty): " +
			currentSummary,
		input: history,
		store: false,
	});

	history.push(
		...dynamicResponse.output.map((output) => ({
			role: output.role,
			content: output.content,
		}))
	);

	if (history.length > 10) {
		const conversationSummary = await client.responses.create({
			model: "gpt-4o-mini",
			instructions:
				"Summarize the conversation in a few sentences. There might be a previous summary as well to be included.",
			input: `Previous summary: ${currentSummary} \n\n Chat history:${JSON.stringify(history)}`,
			store: false,
		});
		currentSummary = conversationSummary.output_text;
		history = [];
		console.log("ConversationSummary: ", conversationSummary.output_text);
	}
	return dynamicResponse.output_text;
}

console.log(
	await dynamicConversationExample(
		"Hello, my name is Joel and I'm a software developer!"
	)
);
console.log(await dynamicConversationExample("What did I say my name was?"));
console.log(
	await dynamicConversationExample(
		"I'm thinking about a job as a programmer, would I be suitable for it?"
	)
);
