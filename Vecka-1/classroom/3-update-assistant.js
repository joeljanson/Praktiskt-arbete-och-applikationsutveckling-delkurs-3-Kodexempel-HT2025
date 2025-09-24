import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function updateAssistant() {
    const assistant = await openai.beta.assistants.retrieve(
			"asst_Q4MGBS6lT4xT6K2LRy966Wl4"
		);
    console.log(assistant);
    console.log("Assistant retrieved, ID is: ", assistant.id);
/* 
    const vectorStoreId = "vs_68af35df1b788191bfd95fd1d6d6ea14";

    await openai.beta.assistants.update(assistant.id, {
			tool_resources: {
				file_search: {
					vector_store_ids: [vectorStoreId],
				},
			},
		});
    console.log("Assistant updated"); */
}

updateAssistant();