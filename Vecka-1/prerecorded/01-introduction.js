import OpenAI from "openai";

import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function chatCompletionsAPI() {
	const completion = await client.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{
				role: "user",
				content: "Write a one-sentence bedtime story about a unicorn.",
			},
		],
	});

	console.log(completion.choices[0].message.content);
}

async function responsesApiNonStreaming() {
	const response = await client.responses.create({
		model: "gpt-4o",
		input: [
			{
				role: "user",
				content: "Write a one-sentence bedtime story about a unicorn.",
			},
		],
	});

	console.log(response.output_text);
}

async function responsesApiStreaming() {
	const stream = await client.responses.create({
		model: "gpt-4o",
		input: [
			{
				role: "user",
				content: "Write a one-sentence bedtime story about a unicorn.",
			},
		],
		stream: true,
	});

	for await (const event of stream) {
		console.log(event.delta);
	}
}

//responsesApiNonStreaming();
//responsesApiStreaming();
//chatCompletionsAPI();
