import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function reasoning() {
    const prompt = `
Write a bash script that takes a matrix represented as a string with 
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
`;
    const response = await client.responses.create({
        model: "o3-mini",
        reasoning: {effort: "high"},
        input: prompt,
    })

    console.log(response.output_text);
}

reasoning();