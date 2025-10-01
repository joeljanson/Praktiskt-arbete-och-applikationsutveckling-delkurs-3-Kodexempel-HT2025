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

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
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

async function uploadPDFToSupabase(pdfPath) {
	try {
		const loader = new PDFLoader(pdfPath);
		const docs = await loader.load();
		//console.log(docs[0].pageContent);

		const textSplitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 500,
		});

		const chunks = await textSplitter.splitDocuments(docs);
		console.log(chunks);

        const vectorStore = await SupabaseVectorStore(embeddings, {
            client:supabase,
            tableName: "documents",
        });

        await vectorStore.addDocuments(chunks);
        
	} catch (error) {
		console.error("Error uploading PDF to Supabase:", error);
	}
}

//uploadPDFToSupabase("./tonejs.pdf");


async function searchSupabase(query1) {
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
        client:supabase,
        tableName: "documents",
        queryName: "match_documents",
    });

    const retriever = vectorStore.asRetriever();

    const promptTemplate = "Please formulate the following query into a standalone question: {query}";
    //const result = llm.invoke(query1);
    //Acknowledgements in the article

    const result = await retriever.invoke(query1);

    //promptTemplate.pipe(llm).pipe(retriever).pipe(llm);

    console.log(result);
}

searchSupabase("I'm sitting here holding a lecture about Tone.js, and I would like to know who the author would like to thank for writing tone.js?");