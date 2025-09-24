import { ChatOpenAI } from "@langchain/openai";

import {
	PromptTemplate,
	SystemMessagePromptTemplate,
	HumanMessagePromptTemplate,
	ChatPromptTemplate,
} from "@langchain/core/prompts";

import { StringOutputParser } from "@langchain/core/output_parsers";

import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

const punctuationTemplate = `Given a sentece, add punctuation where needed.
sentence: {sentence}
Don´t correct or change anything else. leave the grammar as is.
`;

const punctuationPromptTemplate = PromptTemplate.fromTemplate(punctuationTemplate);

const grammarTemplate = `Given a sentece correct the grammar.
punctuated sentence: {punctuated_sentence} 
`;

const grammarPromptTemplate = PromptTemplate.fromTemplate(grammarTemplate);

const chain = punctuationPromptTemplate.pipe(model).pipe(new StringOutputParser())//.pipe(grammarPromptTemplate).pipe(model);

const response = await chain.invoke({
	sentence: "i dont liked mondays", 
});

console.log(response);