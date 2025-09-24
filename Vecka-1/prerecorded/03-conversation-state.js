import OpenAI from "openai";

import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function manualConversationState() {
	const response = await client.responses.create({
		model: "gpt-4o-mini",
		input: [
			{
				role: "user",
				content: "Write a one-sentence bedtime story about a unicorn.",
			},
			{
				role: "system",
				content:
					"Once upon a time, a gentle unicorn named Luna danced under the silver moonlight, sharing her magical sparkles with the sleepy forest creatures as they nestled in for a cozy night's sleep.",
			},
			{
				role: "user",
				content: "What happened next?",
			},
		],
	});
	console.log(response.output_text);
}

async function dynamicConversationState() {
	const history = [
		{
			role: "user",
			content: "Write a one-sentence bedtime story about a unicorn.",
		},
	];

	const response = await client.responses.create({
		model: "gpt-4o-mini",
		input: history,
	});

	console.log(response);

	history.push(
		...response.output.map((output) => ({
			role: output.role,
			content: output.content,
		}))
	);

	history.push({
		role: "user",
		content: "What happened next?",
	});

	console.log(history);

	const secondResponse = await client.responses.create({
		model: "gpt-4o-mini",
		input: history,
	});

	console.log(secondResponse);
	console.log(secondResponse.output_text);
}

async function storedConversationState() {
	/* const response = await client.responses.create({
		model: "gpt-4o-mini",
		input: "Write a one-sentence bedtime story about a unicorn.",
	});

	console.log("Stored response ID:", response.id);
	console.log("Response text:", response.output_text); */

	/*
    As the moonlight danced on the shimmering lake, a gentle unicorn spread her wings to fly, carrying dreams of magic over the sleeping forest.
    */

	const followUpResponse = await client.responses.create({
		model: "gpt-4o-mini",
		previous_response_id:
			"resp_67f3c7fece2c819183ce18ea3664349b0c1027a03e0bbd19",
		input: "What happened next?",
	});

	console.log("Follow-up response ID:", followUpResponse.id);
	console.log("Follow-up response text:", followUpResponse.output_text);
}

//manualConversationState();
//dynamicConversationState();
storedConversationState();