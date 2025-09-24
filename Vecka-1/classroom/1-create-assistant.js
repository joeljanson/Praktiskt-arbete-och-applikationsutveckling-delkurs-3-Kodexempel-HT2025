import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function createAssistant() {
    const assistant = await openai.beta.assistants.create({
        name: "Short story explainer",
        instructions: `You are tasked with answering questions about short stories added to your knowledge base. You will be provided with these stories, and your job is to  summarize them, and answer questions based on their content.
        - **Summary Format**: When a story is requested, provide a summary in paragraph form, approximately 3-5 sentences in length.
        - **Question Answer Format**: Provide detailed answers according to the specific questions about the stories, usually in 1-3 sentences, noting any relevant themes, characters, or plot points.`,
        model: "gpt-4o-mini",
    });
    console.log(assistant);
    console.log("Assistant created, ID is: ", assistant.id);
}

createAssistant();

//Assistant created, ID is:  asst_Q4MGBS6lT4xT6K2LRy966Wl4