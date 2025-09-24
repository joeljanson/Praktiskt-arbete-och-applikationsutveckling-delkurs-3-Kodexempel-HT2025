import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function listMessages() {
    const threadId = "thread_MlfLQWq4cOZdFMuGBAookTK5";
    const threadMessages = await openai.beta.threads.messages.list(threadId);

    console.log("Latest message: ", threadMessages.data[0].content[0].text.value);
    console.log("All messages: ", threadMessages.data);
}

listMessages();