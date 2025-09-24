import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function uploadFile(filePath) {
	const file = await openai.files.create({
		file: fs.createReadStream(filePath),
		purpose: "assistants",
	});
	console.log(file);
    return file.id;
}

async function createVectorStore() {
	const vectorStore = await openai.vectorStores.create({
		name: "Test Vector Store",
	});
	console.log(vectorStore);
	return vectorStore.id;
}

async function addFileToVectorStore(vectorStoreId, fileId) {
	const vectorStoreFile = await openai.vectorStores.files.create(
		vectorStoreId,
		{ file_id: fileId }
	);
	console.log(vectorStoreFile);
	return vectorStoreFile.id;
}

async function main() {
	const fileId = await uploadFile("zalando-2.pdf");
	console.log(fileId);
	const vectorStoreId = await createVectorStore();
	console.log("Vector Store Created");
	console.log("vectorStoreId", vectorStoreId);
	await addFileToVectorStore(vectorStoreId, fileId);
	console.log("File Added to Vector Store");
	//vs_68b8634646bc8191831a785cb7347545
	//file-HZk85EhPCsaLycDVvBDkz8
}

main();