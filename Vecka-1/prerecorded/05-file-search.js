import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function uploadFile() {
    const file = fs.createReadStream("short-story.pdf");
    const fileUpload = await client.files.create({
        purpose: "assistants",
        file: file
    })

    console.log(fileUpload.id);
    return fileUpload.id;

}

async function attachToVectorStore() {
    const fileId = await uploadFile();
    console.log("File ID: ", fileId);
    const vectorStore = await client.vectorStores.create({
        name: "Short Stories",
    })

    const vectorStoreId = vectorStore.id;

    const vectorStoreFile = await client.vectorStores.files.create(
        vectorStoreId,
        {
            file_id: fileId,
        }
    )

    console.log(vectorStoreFile);

    const listResults = await client.vectorStores.files.list(vectorStoreId);
    console.log(listResults);
    return vectorStoreId;
}

async function fileSearch() {
    const vectorStoreId = "vs_67f3ceb6a81881919207cd35cac4b240"; //await attachToVectorStore();
    //console.log("Vector Store ID: ", vectorStoreId);
    const response = await client.responses.create({
        model: "gpt-4o-mini",
        //tools: [{ type: "file_search", vector_store_ids: [vectorStoreId] }],
        input: "Who wrote the clockmakers apprentice and what is it about?",
    })

    console.log(response.output_text);
}

fileSearch();