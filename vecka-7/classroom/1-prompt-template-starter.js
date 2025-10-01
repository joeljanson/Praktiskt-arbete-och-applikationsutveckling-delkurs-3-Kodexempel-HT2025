import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();


/**
 * Övning 1 går ut på att ni ska skapa en universell översättare.
 * Vi kan tänka oss ett gränssnitt där användaren kan skriva in en text, välja målspråk och ton.
 * Ton skulle kunna väljas från en lista med olika tonfall.
 * 
 * Här skippar vi gränssnittet men ert jobb är att skriva en PromptTemplate som kan användas för att översätta en text till ett visst målspråk och ton.
 * Sedan ska ni köra prompten genom en LLM och se vad som kommer ut.
 * Testa gärna med olika målspråk och ton.
 * Testa gärna med olika LLM:er.
 * Testa gärna med olika prompt strategier och fler variabler om ni kommer på fler användningsområden.
 */

// Kom ihåg att lägga till era api-nycklar i .env filen (e.g., process.env.OPENAI_API_KEY)

async function runTranslator() {
	const llm = new ChatOpenAI({
		modelName: "gpt-4o-mini",
		temperature: 0.7,
	});


	const templateString = `Det här är en template string. {en_variabel} som går att byta ut.`;
    //I denna övning behöver ni tre variabler:
    // 1. text_to_translate
    // 2. target_language
    // 3. tone

	const translatorPrompt = PromptTemplate.fromTemplate(templateString);

	const inputValues = {
		en_variabel:
			"Denna texten ersätter variabeln i strängen ovan när vi kör den genom en kedja.",
	};
    //Här behöver ni lägga in de värden ni vill använda för att byta ut variablerna i strängen ovan.

	// Kommentera ut följande rad om ni vill se vad ni skickar in till LLM
	// const formattedPrompt = await translatorPrompt.format(inputValues);
	// console.log("Formatted Prompt:\n", formattedPrompt);

	//const chain = Skapa en kedja med .pipe()
	//const result = Invokera kedjan på något sätt.

	console.log(`Original Text: ${inputValues.text_to_translate}`);
	console.log(`Target Language: ${inputValues.target_language}`);
	console.log(`Tone: ${inputValues.tone}`);
	console.log("---");
	console.log("Adapted Translation:\n", result.content);

}

runTranslator();
