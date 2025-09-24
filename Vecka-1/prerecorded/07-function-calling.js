import OpenAI from 'openai';

import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const tools = [
    {
        type: "function",
        name: "send_email",
        description: "Send an email to a given recipient with a subject and message.",
        parameters: {
            type: "object",
            properties: {
                to: { type: "string", description: "The recipient email address." },
                subject: { type: "string", description: "Email subject line." },
                body: { type: "string", description: "Body of the email message." },
            },
            required: ["to", "subject", "body"],
            additionalProperties: false,
        },
    }
];

async function functionCallingExample() {
    const response = await client.responses.create({
        model: "gpt-4o",
        input: "Can you send an email to joel@example.com and gisela@example.com saying hi?",
        tools: tools,
    });

    console.log("response.output: ", response.output);
    console.log("response.output[0]: ", response.output[0]);
    console.log("response.output[1]: ", response.output[1]);
}

// Run example
async function runExample() {
    console.log("\n=== Function Calling Example ===");
    await functionCallingExample();
}

// Uncomment to run example
//runExample(); 