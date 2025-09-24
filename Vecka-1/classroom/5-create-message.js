import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function createMessage() {
	const threadId = "thread_MlfLQWq4cOZdFMuGBAookTK5";
	const message = await openai.beta.threads.messages.create(threadId, {
		role: "user",
		content: "Who wrote the clockmakers apprentice?",
	});
	console.log(message);
	console.log("Message created, ID is: ", message.id);
	//Message created, ID is:  msg_iCHGmqQeSw53wLHYLri0CTWC
}

createMessage();