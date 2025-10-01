// 1. Läs in PDF -> PDFLoader
// npm install pdf-parse @langchain/community @langchain/openai @langchain/core @supabase/supabase-js
// 2. Dela upp PDFen i delar (chunks)
// TextSplitter
// 3. Ta alla chunks och skapa embeddings + ladda upp till Supabase
// En embeddingmodell, skriva supabase funktioner på klienten
//Skapa tabellen som ska ta emot våra embeddings.
// Langchains VectorStores -> Supabase
// 4. Söka efter relevanta chunks med embeddings
// För att söka i databasen så används fortfarande en funktion i SQL hos supabase

import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";

dotenv.config();

const sbApiKey = process.env.SUPABASE_ANON_KEY;
const sbUrl = process.env.SUPABASE_URL;
const apiKey = process.env.OPENAI_API_KEY;

const supabase = createClient(sbUrl, sbApiKey);

const embeddings = new OpenAIEmbeddings({
	model: "text-embedding-3-small",
	apiKey: apiKey,
});

async function searchSupabase(query1) {
	const vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
		client: supabase,
		tableName: "documents",
		queryName: "match_documents",
	});

	const retriever = vectorStore.asRetriever();

	const result = await retriever.invoke(query1);
}

async function chatWithRetrivalAndPromptTemplates(query) {
	const llm = new ChatOpenAI({
		model: "gpt-4o-mini",
		apiKey: apiKey,
	});

	const vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
		client: supabase,
		tableName: "documents",
		queryName: "match_documents",
	});

	const retriever = vectorStore.asRetriever();

	//1. Formulate the query into a standalone question
	const standAloneQuestionTemplate = PromptTemplate.fromTemplate(
		"Please formulate the following query into a standalone question: {query}"
	);

    const answerTemplate = PromptTemplate.fromTemplate(
        "Answer the following question based on the provided context: {context} Question: {question}"
    );

	const standaloneQuestionChain = standAloneQuestionTemplate
		.pipe(llm)
		.pipe(new StringOutputParser())
		.pipe(retriever)
        .pipe(answerTemplate) //context {context:retriverResults??? question: query?? RunnablePassthrough}
        .pipe(llm)
        .pipe(new StringOutputParser());

	const standaloneQuestion = await standaloneQuestionChain.invoke({
		query: query,
	});

	console.log(standaloneQuestion);

	//2. Search the database for the standalone question
	/* const result = await retriever.invoke(standaloneQuestion);

	console.log(result); */

    
}

chatWithRetrivalAndPromptTemplates(
	"I was reading about tone.js the other day and I would like to know who the author would like to thank for writing tone.js?"
);
