import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function callResponseApi(query) {
    const vectorStoreId = "vs_68b8634646bc8191831a785cb7347545";
    const response = await openai.responses.create({
			model: "gpt-5",
            input: query,
            instructions: "You are a helpful assistant that can answer questions about return policies for Zalando. Always reply in the language of the question and remember that you are a chatbot so don't include references to any context. Always answer with only one short (max 10 words) sentence.",
            tools: [{
                type: "file_search",
                vector_store_ids: [vectorStoreId]
            }]
		});
    
    console.log(JSON.stringify(response, null, 2));
    console.log("--------------------------------");
    console.log(response.output_text);
}

callResponseApi("Hur många dagar har jag på mig att returnera en vara?");

async function secondCallResponseApi(query) {
    const vectorStoreId = "vs_68b8634646bc8191831a785cb7347545";
    const response = await openai.responses.create({
			model: "gpt-5",
			previous_response_id:
				"resp_68b86638d45081a1943c34c2eecb6daf0b5d2120b682e9fb",
			instructions:
				"You are a helpful assistant that can answer questions about return policies for Zalando. Always reply in the language of the question and remember that you are a chatbot so don't include references to any context. Always answer with only one short (max 10 words) sentence.",
			input: query,
		});
    console.log(JSON.stringify(response, null, 2));
    console.log("--------------------------------");
    console.log(response.output_text);
}
//resp_68b86638d45081a1943c34c2eecb6daf0b5d2120b682e9fb
//secondCallResponseApi("Men överallt i deras returnpolicy står att jag har 14 dagar att returnera en vara.");

async function thirdCallResponseApi(query) {
    const response = await openai.responses.create({
			model: "gpt-5",
			instructions:
				`You are a helpful assistant that can answer questions about return policies for Zalando. 
                Always reply in the language of the question and remember that you are a chatbot 
                so don't include references to any context. Always answer with only one short (max 10 words) sentence.
                Please always use the web search tool to find the information you need. And make sure the information is up to date.`,
			tools: [{ type: "web_search" }],
			input: query,
		});
    console.log(JSON.stringify(response, null, 2));
    console.log("--------------------------------");
    console.log(response.output_text);
}

//thirdCallResponseApi("Hur många dagar har jag på mig att returnera en vara?");