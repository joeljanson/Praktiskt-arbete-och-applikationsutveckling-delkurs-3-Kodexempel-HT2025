const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function codeInterpreterExample() {
	/* const assistant = await openai.beta.assistants.create({
        model: "gpt-4o-mini",
        instructions: "You are a personal math tutor. When asked a math question, write and run code to answer the question.",
        tools: [{type: "code_interpreter"}],
    }); */

	console.log(assistant.id);
	const assistantId = "asst_XRGr32uB8LYuSO9pCnQv3ADY";

	// const thread = await openai.beta.threads.create();
	const threadId = "thread_gURCVM8dClkSFUnQLxPj7gRd";
	console.log(thread.id);

	const threadMessages = await openai.beta.threads.messages.create(threadId, {
		role: "user",
		content: "I need to solve the equation `3x + 11 = 14`. Can you help me?",
	});

	const run = await openai.beta.threads.runs.create(threadId, {
		assistant_id: assistantId,
	});

	console.log(run.id);
	//run_lmMqsvGVScsq7UAwU5kmZ4Bd
}

async function listMessages() {

    const threadId = "thread_gURCVM8dClkSFUnQLxPj7gRd";
    const runId = "run_lmMqsvGVScsq7UAwU5kmZ4Bd";

    const runSteps = await openai.beta.threads.runs.steps.list(threadId, runId);

    console.log(JSON.stringify(runSteps, null, 2));

    const messages = await openai.beta.threads.messages.list(threadId);

    console.log(JSON.stringify(messages, null, 2));
}
listMessages();
//codeInterpreterExample();