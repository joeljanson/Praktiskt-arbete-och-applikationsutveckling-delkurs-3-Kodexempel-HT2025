import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function callResponseApi(query) {
	const conversation = await openai.conversations.create();
	console.log(JSON.stringify(conversation, null, 2));
	const conversationId =
		"conv_68b87336c740819380cbfb10ab0148da0242360b0f23caf9";
	const vectorStoreId = "vs_68b8634646bc8191831a785cb7347545";
	const response = await openai.responses.create({
		model: "gpt-5",
		input: query,
		instructions:
			"You are a helpful assistant that can answer questions about return policies for Zalando. Always reply in the language of the question and remember that you are a chatbot so don't include references to any context. Always answer with only one short (max 10 words) sentence.",
		tools: [
			{
				type: "file_search",
				vector_store_ids: [vectorStoreId],
			},
		],
		conversation: conversationId,
	});

	console.log(JSON.stringify(response, null, 2));
	console.log("--------------------------------");
	console.log(response.output_text);
}
/* 
callResponseApi(
	"Är du säker? Det står 14 dagar och 100 dagar är ju lagstadgat?"
); */

async function fetchConversation() {
	const conversationId =
		"conv_68b87336c740819380cbfb10ab0148da0242360b0f23caf9";
	const conversation = await openai.conversations.retrieve(conversationId);
	console.log(JSON.stringify(conversation, null, 2));
	const items = await openai.conversations.items.list(conversationId, {
		limit: 10,
	});
	console.log(JSON.stringify(items, null, 2));
		console.log(items.data);
}

fetchConversation();
