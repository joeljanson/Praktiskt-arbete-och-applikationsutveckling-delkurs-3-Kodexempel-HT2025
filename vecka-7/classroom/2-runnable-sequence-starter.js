import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import {
	RunnableSequence,
	RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";

dotenv.config();

/**
 * Övning 2: "Product Pulse Checker"
 *
 * Jag har satt ihop en kedja för att generera hypotetiska produktrecensioner
 * Nu vill jag att ni skapar en ny kedja som kan sammanfatta dessa recensioner
 * och ge tillbaka en lista med fördelar och nackdelar.
 * 
 * Se instruktioner nedan.
 *
 */

async function runProductPulseChecker() {
	const llm = new ChatOpenAI({
		modelName: "gpt-4o-mini", // Byt gärna modell för att se skillnader
		temperature: 0.7,
	});
	const outputParser = new StringOutputParser();

	// --- 1. reviewGeneratorChain ---
    // Detta är min kedja som ni kan inspireras av.
	const reviewGenPromptText = `Du är en hjälpsam AI-assistent.
Generera 10 korta, varierade kundrecensionsutdrag för produkten: {product_name}.
Inkludera en blandning av positiva, negativa och neutrala poänger. Få dem att låta som riktiga kunder.
Varje utdrag ska vara på en ny rad. Ge bara utdragen, inget annat.`;

	const reviewGenPromptTemplate =
		PromptTemplate.fromTemplate(reviewGenPromptText);

	const reviewGeneratorChain = RunnableSequence.from([
		reviewGenPromptTemplate,
		llm,
		outputParser,
	]);

	// --- 2. summarizerChain ---
	const summarizerPromptText = `Här vill jag att ni skriver en bra prompt så att modellen kan sammanfatta recensionerna och 
    ge tillbaka en lista med fördelar och nackdelar utifrån recensionerna. Ni behöver använda variabeln {generated_reviews} som input.
    Förslagsvis kan det vara bra att skicka med produktnamnet {product_name} i denna prompttemplate också.`;
    

    //Här ska ni sedan skapa en runnable sequence likt den som skapas ovan (reviewGeneratorChain).
    //När ni gjort detta och skrivit en bra prompt så kan ni köra denna fil och få ut ett resultat.
	

	// --- 3. overallChain ---
	// Vi vill att `summarizerChain` ska få både det ursprungliga `product_name`
	// och de `generated_reviews`.
	const overallChain = RunnableSequence.from([
		{
			// `generated_reviews` kommer att vara output från `reviewGeneratorChain`.
			// `reviewGeneratorChain` tar emot hela input till detta steg (dvs. { product_name: ... }).
			generated_reviews: reviewGeneratorChain,
			// `product_name` skickas vidare från den ursprungliga inputen till `overallChain`.
			// (input) => input.product_name ser till att vi plockar ut product_name från det objekt som skickas till overallChain.invoke()
			product_name: (input) => input.product_name,

		},
        //Här kan ni använda en lambda funktion för att logga mellanresultatet vi får från kedjan ovan.
		summarizerChain,
	]);

	const productName = "Den Fantastiska Kaffebryggaren X2000"; //Byt gärna ut mot en annan produkt
	console.log(`Kör Product Pulse Checker för: ${productName}\n---`);

	const result = await overallChain.invoke({ product_name: productName });

	console.log(
		"\n--- Genererade Recensioner (mellanresultat, om du vill logga det) ---"
	);

	console.log(`\n--- Slutgiltig Sammanfattning för ${productName} ---`);
	console.log(result);

}

runProductPulseChecker();
