import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// ------------------------------------------------------------

// Upload and list files

// ------------------------------------------------------------

async function uploadFile(filename) {
	const file = await openai.files.create({
		file: fs.createReadStream(filename),
		purpose: "assistants",
	});
	return file.id;
}

async function listFiles() {
	const files = await openai.files.list();
	for (const file of files.data) {
		console.log(file.id);
		console.log(file);
	}
}

//uploadFile("tonejs.pdf");
//listFiles();

// ------------------------------------------------------------

// List vector stores
// Create a new vector store
// Delete a vector store
// Update a vector store name
// Add a file to a vector store
// Add multiple files to a vector store
// List files in a vector store

// ------------------------------------------------------------

async function listVectorStores() {
	const vectorStores = await openai.vectorStores.list();
	for (const vectorStore of vectorStores.data) {
		console.log(vectorStore.id);
		console.log(vectorStore);
	}
}

async function createVectorStore() {
	const vectorStore = await openai.vectorStores.create({
		name: "my-vector-store",
	});
	return vectorStore.id;
}

async function deleteVectorStore(vectorStoreId) {
	const vectorStore = await openai.vectorStores.del(vectorStoreId);
	console.log(vectorStore);
	return vectorStore.id;
}

async function updateVectorStoreName(vectorStoreId, name) {
	const vectorStore = await openai.vectorStores.update(vectorStoreId, {
		name: name,
	});
	return vectorStore.id;
}

async function addFileToVectorStore(vectorStoreId, fileId) {
	const vectorStoreFile = await openai.vectorStores.files.create(
		vectorStoreId,
		{
			file_id: fileId,
		}
	);
	console.log(vectorStoreFile);
	return vectorStoreFile.id;
}

async function addMultipleFilesToVectorStore(vectorStoreId, fileIds) {
	const vectorStoreFiles = await openai.vectorStores.fileBatches.createAndPoll(
		vectorStoreId,
		{
			file_ids: fileIds,
		}
	);
	console.log(vectorStoreFiles);
	return vectorStoreFiles.id;
}

async function listVectorStoreFiles(vectorStoreId) {
	const vectorStoreFiles = await openai.vectorStores.files.list(vectorStoreId);
	for (const vectorStoreFile of vectorStoreFiles.data) {
        //Added to retrive filename of the file
		const fileMetadata = await openai.files.retrieve(vectorStoreFile.id);
		console.log(`File ID: ${vectorStoreFile.id}`);
		console.log(`File Name: ${fileMetadata.filename}`);
	}
}

// ------------------------------------------------------------

// Call responses api to retrieve information from vector store

// ------------------------------------------------------------

async function callResponsesApiWithFileSearch(vectorStoreId, query) {
	const response = await openai.responses.create({
		model: "gpt-4o-mini",
		instructions:
			"You are a helpful assistant that can answer questions about Tone.js.",
		input: query,
		tools: [
			{
				type: "file_search",
				vector_store_ids: [vectorStoreId],
				ranking_options: {
					score_threshold: 0.5, //Här kan vi sätta score threshold för att filtrera resultat med responses api (görs på samma sätt för assistant api)
				},
			},
		],
		include: ["output[*].file_search_call.search_results"],
	});
	console.log(JSON.stringify(response, null, 2));
	console.log(response.output_text);
}

/* callResponsesApiWithFileSearch(
	"vs_67fd046b94888191a4ddcea132de191e",
	"Who would the creator of Tone.js like to thank?"
); */

// ------------------------------------------------------------

// Search vector store

// ------------------------------------------------------------

async function searchVectorStore(vectorStoreId, query) {
	const searchResults = await openai.vectorStores.search(vectorStoreId, {
		query: query,
		rewrite_query: true,
	});

	//Efter närmare eftersökningar så kan vi tydligen inte använda score threshold
	//så vi måste använda en annan metod för att filtrera resultat när vi söker efter
	//relevanta filer med vectorStores.search
	//Se nedan:

	for (const result of searchResults.data) {
		if (result.score > 0.5) {
			console.log(result.score);
			console.log(result.file_id);
			console.log(result.content[0].text);
		}
	}
}

/* searchVectorStore(
	"vs_67fd046b94888191a4ddcea132de191e",
	"Who would the creator of Tone.js like to thank?"
);
 */
