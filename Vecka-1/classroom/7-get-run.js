import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function getRun() {
    const threadId = "thread_MlfLQWq4cOZdFMuGBAookTK5";
    const runId = "run_tj42An1jkY599toUiIPUh5jE";
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    console.log(run);
    console.log("Run retrieved, ID is: ", run.id);
    console.log("Run status: ", run.status);
    console.log("Run completed at: ", run.completed_at);
    console.log("Run created at: ", run.created_at);
    console.log("Run expires at: ", run.expires_at);
    console.log("Run started at: ", run.started_at);
    console.log("Run cancelled at: ", run.cancelled_at);
}

getRun();