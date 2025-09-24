import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPEN_AI_API_KEY,
});

// ------------------------------------------------------------

// Create an assistant

// ------------------------------------------------------------

async function createAssistant() {
	const assistant = await openai.beta.assistants.create({
		name: "Return policy assistant",
		instructions:
			"You are a helpful assistant that can answer questions about return policies for BrightGood Inc. Always reply in the language of the question and remember that you are a chatbot so don't include references to any context.",
		model: "gpt-4o-mini",
		tools: [{ type: "file_search" }],
	});
	console.log(assistant);
	//asst_Wfm716LebRr47xRzWe5RCfnh
}

async function deleteAssistant(assistantId) {
	const assistant = await openai.beta.assistants.del(assistantId);
	console.log(assistant);
}

async function listAssistants() {
	const assistants = await openai.beta.assistants.list();
	console.log(assistants.data);
}
//deleteAssistant("asst_6I6Oofgr4SJBIyPrZ8u6naK6");
//listAssistants();
//createAssistant();

// ------------------------------------------------------------

// Update an assistant

// ------------------------------------------------------------

async function updateAssistant(assistantId) {
	const assistant = await openai.beta.assistants.update(assistantId, {
		tool_resources: {
			file_search: {
				vector_store_ids: ["vs_67fd2dff5b6081919be5a4400dd0190c"],
			},
		},
	});
	console.log(assistant);
}

async function updateAssistantInstructions(assistantId) {
	const assistant = await openai.beta.assistants.update(assistantId, {
		instructions:
			"You are a helpful assistant that can answer questions about return policies for BrightGood Inc. Always reply in the language of the question and remember that you are a chatbot so don't include references to any context.",
	});
	console.log(assistant);
}

//updateAssistant("asst_Wfm716LebRr47xRzWe5RCfnh");
//updateAssistantInstructions("asst_Wfm716LebRr47xRzWe5RCfnh");
// ------------------------------------------------------------

// Create a thread
// Add a message to a thread

// ------------------------------------------------------------

async function createThreadAndAddMessage() {
	const thread = await openai.beta.threads.create();
	console.log(thread);
	console.log(thread.id);
	//thread_EWF4wBy3CJ8ay7ngXuWCyUgq

	const message = await openai.beta.threads.messages.create(thread.id, {
		role: "user",
		content:
			"Jag vill returnera en produkt, det är en apelsin. Kan jag returnera den?",
	});
	console.log(message);
}

//createThreadAndAddMessage();

// ------------------------------------------------------------

// Create a run

// ------------------------------------------------------------

async function createRun(assistantId, threadId) {
	const run = await openai.beta.threads.runs.create(threadId, {
		assistant_id: assistantId,
	});
	console.log(run);
	//run_KHad1sJM3iM0TEqrpKG9qKTR
}

createRun("asst_Wfm716LebRr47xRzWe5RCfnh", "thread_8EGQ27EpBRsYpHnVH7VKSkgh");

async function getRun(threadId, runId) {
	const run = await openai.beta.threads.runs.retrieve(threadId, runId);
	console.log(run);
}

//getRun("thread_8EGQ27EpBRsYpHnVH7VKSkgh", "run_fvCc6h2byo2ZDVSSEOa5e9M3");

// ------------------------------------------------------------

// Log the messages in a thread

// ------------------------------------------------------------

async function getMessages(threadId) {
	const messages = await openai.beta.threads.messages.list(threadId);
	console.log(messages.data);
	console.log(messages.data[0].content[0].text.value);
}

//getMessages("thread_8EGQ27EpBRsYpHnVH7VKSkgh");
