import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import dotenv from "dotenv";

dotenv.config();

const embeddings = new OpenAIEmbeddings({
	model: "text-embedding-3-small",
	apiKey: process.env.OPENAI_API_KEY,
});

const vectorStore = new MemoryVectorStore(embeddings);

async function loadAndSplitPDF(pdfPath) {
	
    //Ladda in en lokal pdf och läs in i den lokala memoryvectorstore
    const loader = new PDFLoader(pdfPath);
    const result = await loader.load();
    //console.log(result);

	//console.log(result);
	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 3200,
		chunkOverlap: 1600,
	});
	const chunks = await textSplitter.splitDocuments(result);
	//console.log(chunks);

	await vectorStore.addDocuments(chunks);
}

async function main(prompt) {
	await loadAndSplitPDF("./tonejs.pdf");

	const similaritySearchWithScoreResults =
		await vectorStore.similaritySearchWithScore(prompt, 4);
	for (const [doc, score] of similaritySearchWithScoreResults) {
		console.log("\n\n\n====================\n\n\n");
		console.log("Score: ", score);
		console.log("Content: ", doc.pageContent);
	}

	/* 
    const retriever = vectorStore.asRetriever();

    const result = await retriever.invoke(prompt);
    console.log("\n\n\n Found the following relevant chunks:\n\n\n");
    console.log(result); */
   
}

main("who is acknowledged?");
