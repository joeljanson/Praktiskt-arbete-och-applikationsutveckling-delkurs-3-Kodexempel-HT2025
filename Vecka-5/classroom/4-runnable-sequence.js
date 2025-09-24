import { ChatOpenAI } from "@langchain/openai";

import {
	PromptTemplate,
	SystemMessagePromptTemplate,
	HumanMessagePromptTemplate,
	ChatPromptTemplate,
} from "@langchain/core/prompts";

import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { RunnablePassthrough } from "@langchain/core/runnables";
import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
dotenv.config();

const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	apiKey: process.env.OPENAI_API_KEY,
});

const geminiModel = new ChatGoogleGenerativeAI({
	model: "gemini-2.5-flash-preview-04-17",
	apiKey: process.env.GEMINI_API_KEY,
});


const punctuationTemplate = `Given a sentece, add punctuation where needed.
sentence: {sentence}
Don´t correct or change anything else.
`;

const punctuationPromptTemplate =
	PromptTemplate.fromTemplate(punctuationTemplate);

const grammarTemplate = `Given a sentece correct the grammar.
punctuated sentence: {punctuated_sentence} 
`;

const grammarPromptTemplate = PromptTemplate.fromTemplate(grammarTemplate);

const translateTemplate = `Translate the following sentence to {language}.
sentence: {grammar_corrected_sentence}
`;

const translatePromptTemplate = PromptTemplate.fromTemplate(translateTemplate);

/* const chain = punctuationPromptTemplate
	.pipe(model)
	.pipe(new StringOutputParser())
	.pipe(grammarPromptTemplate)
	.pipe(model); */

/* const chain = punctuationPromptTemplate
	.pipe(model)
	.pipe((prevresult) => {
		return { punctuated_sentence: prevresult.content };
	})
	.pipe(grammarPromptTemplate)
	.pipe(model)
    .pipe(new StringOutputParser())
    .pipe((prevresult) => {
        console.log("Previous result:", prevresult);
		return { grammar_corrected_sentence: prevresult };
	})
    .pipe(translatePromptTemplate)
    .pipe(model)
    .pipe(new StringOutputParser()); */
/* 
const chain = RunnableSequence.from([
	punctuationPromptTemplate,
	model,
	new StringOutputParser(),
	//{punctuated_sentence: (prevResult) => {prevResult}}
	(prevResult) => {
		console.log("Previous result:", prevResult);
		return { punctuated_sentence: prevResult };
	},
	grammarPromptTemplate,
	(prevResult) => {
		console.log("Previous result:", prevResult);
		return prevResult;
	},
	model,
	new StringOutputParser(),
]); */





const punctuatedSentenceChain = RunnableSequence.from([
	punctuationPromptTemplate,
	model,
	new StringOutputParser(),
]);
const grammarChain = RunnableSequence.from([
	grammarPromptTemplate,
	model,
	new StringOutputParser(),
]);
const translationChain = RunnableSequence.from([
	translatePromptTemplate,
	model,
	new StringOutputParser(),
]);

const chain = RunnableSequence.from([
	{
		punctuated_sentence: punctuatedSentenceChain,
		original_input: new RunnablePassthrough(),
	},
	{
		grammar_corrected_sentence: grammarChain,
		language: ({ original_input }) => original_input.language,
	},
	translationChain,
]); 

const response = await chain.batch([
	{
		sentence: "i dont liked mondays",
		language: "Swedish",
	},
	{
		sentence: "i dont liked wednesys either",
		language: "French",
	},
]);

console.log("Final response:", response);
