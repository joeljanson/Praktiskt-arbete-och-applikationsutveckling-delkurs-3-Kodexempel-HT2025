import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function createThread() {
    
    const thread = await openai.beta.threads.create();
    console.log(thread);
    console.log("Thread created, ID is: ", thread.id);
    return thread.id;
}

async function main() {
	const threadId = await createThread();
	console.log("Thread ID: ", threadId);
	//thread_MlfLQWq4cOZdFMuGBAookTK5
}

main();