import { ChatOpenAI } from "@langchain/openai";

import {
	PromptTemplate,
	SystemMessagePromptTemplate,
	HumanMessagePromptTemplate,
	ChatPromptTemplate,
} from "@langchain/core/prompts";

import dotenv from "dotenv";

dotenv.config();

const systemPromptTemplate = SystemMessagePromptTemplate.fromTemplate(
	"You are a language translator. Translate the following text into {language}"
);

const promptTemplate = PromptTemplate.fromTemplate(
	"You are a language translator. Translate the following text into {language}"
);

const humanPromptTemplate = HumanMessagePromptTemplate.fromTemplate("{text}");
/* 
console.log(await systemPromptTemplate.format({ language: "Swedish" }));
console.log(await promptTemplate.format({ language: "Swedish" }));
console.log(await humanPromptTemplate.format({ text: "Hello, world!" })); */

const chatPromptTemplate = ChatPromptTemplate.fromMessages([
	systemPromptTemplate,
	humanPromptTemplate,
]);

/* 
const chatPromptTemplate = ChatPromptTemplate.fromMessages([
	[
		"system",
		"You are a language translator. Translate the following text into {language}",
	],
	["user", "{text}"],
]);
 */
/* console.log(
	await chatPromptTemplate.format({
		language: "Swedish",
		text: "Hello, world!",
	})
); */

async function main() {
	const model = new ChatOpenAI({
		model: "gpt-4o-mini",
		apiKey: process.env.OPENAI_API_KEY,
	});

	const chain = chatPromptTemplate.pipe(model);

	const response = await chain.invoke({
		language: "Swedish",
		text: "Hello, world!",
	});
	console.log(response.content);


	const batchedResponse = await chain.batch([{
		language: "Swedish",
		text: "Hello, world!",
	},
	{
		language: "Spanish",
		text: "Hello, world!",
	},
	{
		language: "Norwegian",
		text: "Hello, world!",
	}]);
	console.log(batchedResponse);
}

main();
