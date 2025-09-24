import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function createFile() {
    const file = await openai.files.create({
        file: fs.createReadStream("short-story.pdf"),
        purpose: "assistants",
    });
    console.log(file);
    console.log("File created, ID is: ", file.id);
    return file.id;
}

async function addFileToVectorStore(fileId) {
    const vectorStore = await openai.vectorStores.create({
        name: "Short stories vector test",
    });
    console.log(vectorStore);
    console.log("Vector store created, ID is: ", vectorStore.id);
    await openai.vectorStores.files.create(vectorStore.id, {
        file_id: fileId,
    });
    console.log("File added to vector store");
    return vectorStore.id;
}

async function main() {
    const fileId = await createFile();
    console.log("File ID: ", fileId);
    const vectorStoreId = await addFileToVectorStore(fileId);
    console.log("Vector store ID: ", vectorStoreId);
}

main();