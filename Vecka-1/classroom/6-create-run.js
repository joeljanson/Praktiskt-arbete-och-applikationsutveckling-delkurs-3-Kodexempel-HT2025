import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function runThread() {
    const threadId = "thread_MlfLQWq4cOZdFMuGBAookTK5";
    const assistantId = "asst_Q4MGBS6lT4xT6K2LRy966Wl4";
    const run = await openai.beta.threads.runs.create(
			threadId,
			{ assistant_id: assistantId }
			//Här kan vi lägga till tools för den specifika körningen om så behövs.
		);
    console.log(run);
    console.log("Run created, ID is: ", run.id);
}

runThread();

/*
{
  id: 'run_tj42An1jkY599toUiIPUh5jE',
  object: 'thread.run',
  created_at: 1756313920,
  assistant_id: 'asst_Q4MGBS6lT4xT6K2LRy966Wl4',
  thread_id: 'thread_MlfLQWq4cOZdFMuGBAookTK5',
  status: 'queued',
  started_at: null,
  expires_at: 1756314520,
  cancelled_at: null,
  failed_at: null,
  completed_at: null,
  required_action: null,
  last_error: null,
  model: 'gpt-4o-mini',
  instructions: 'You are tasked with answering questions about short stories added to your knowledge base. You will be provided with these stories, and your job is to  summarize them, and answer questions based on their content.\n' +
    '        - **Summary Format**: When a story is requested, provide a summary in paragraph form, approximately 3-5 sentences in length.\n' +
    '        - **Question Answer Format**: Provide detailed answers according to the specific questions about the stories, usually in 1-3 sentences, noting any relevant themes, characters, or plot points.',
  tools: [],
  tool_resources: {},
  metadata: {},
  temperature: 1,
  top_p: 1,
  reasoning_effort: null,
  max_completion_tokens: null,
  max_prompt_tokens: null,
  truncation_strategy: { type: 'auto', last_messages: null },
  incomplete_details: null,
  usage: null,
  response_format: 'auto',
  tool_choice: 'auto',
  parallel_tool_calls: true
}
Run created, ID is:  run_tj42An1jkY599toUiIPUh5jE
*/