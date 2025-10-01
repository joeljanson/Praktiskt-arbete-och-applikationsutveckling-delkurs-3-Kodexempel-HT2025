import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import dotenv from "dotenv";

dotenv.config();

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
});

const vectorStore = new MemoryVectorStore(embeddings);

async function loadAndSplitWikipedia(query) {
    const wikipedia = new WikipediaQueryRun(
        {
            topKResults: 5,
            maxDocContentLength: 10000,
        }
    );
    const result = await wikipedia.invoke(query);
    //console.log(result);
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 500,
    });
    const chunks = await textSplitter.createDocuments([result]);
    console.log(chunks);

    await vectorStore.addDocuments(chunks);
}

async function main(prompt) {
    await loadAndSplitWikipedia(prompt);


    const similaritySearchWithScoreResults =
			await vectorStore.similaritySearchWithScore(
				"What is retrieval?",
				2
			);
    for (const [doc, score] of similaritySearchWithScoreResults) {
        console.log("\n\n\n====================\n\n\n");
        console.log("Score: ", score);
        console.log("Content: ", doc.pageContent);
    }

    /*
    const retriever = vectorStore.asRetriever();

    const result = await retriever.invoke("What is retrieval about in Langchain?");
    console.log("\n\n\n Found the following relevant chunks:\n\n\n");
    console.log(result);
    */
}

main("What is retrieval in langchain?");
