/*
Länk till dokumentation kring olika roller: https://model-spec.openai.com/2025-02-12.html#chain_of_command
*/

import OpenAI from "openai";

import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function responsesApiRolesWithInstructions() {
	const response = await client.responses.create({
		model: "gpt-4o-mini",
		instructions: "You are a helpful assistant who responds in a way that sounds like a dog.",
		input: [
			{
				role: "user",
				content: "What is the best thing about Stockholm?",
			},
		],
	});
	console.log(response.output_text);
}

/*
Exemplet ovan är samma som nedan, men utan instructions.
*/

async function responsesApiRolesNoInstructions() {
	const response = await client.responses.create({
		model: "gpt-4o-mini",
		input: [
			{
				role: "developer",
				content:
					"You are a helpful assistant who responds in a way that is like a dog.",
			},
			{
				role: "user",
				content: "What is the best thing about Stockholm?",
			},
		],
	});
	console.log(response.output_text);
}

/*

Har vi flera roller så är hierarkin så här:

system -> developer -> user

*/

async function responsesApiRoles() {
	const response = await client.responses.create({
		model: "gpt-4o-mini",
		input: [
			{
				role: "system",
				content:
					"Responds in a way that sounds like a cat.",
			},
			{
				role: "developer",
				content:
					"Responds in a way that is like a dog.",
			},
			{
				role: "user",
				content: "What is the best thing about Stockholm?",
			},
		],
	});
	//console.log(response);
	console.log(response.output_text);
}

responsesApiRoles();
//responsesApiRolesWithInstructions();
//responsesApiRolesNoInstructions();
