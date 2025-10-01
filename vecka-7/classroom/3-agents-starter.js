import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { TavilySearch } from "@langchain/tavily";

dotenv.config();

/**
 * Övning 3: "Team Knowledge Navigator" Agent
 *
 * Mål: Skapa en enkel agent med `createReactAgent` som använder ett anpassat verktyg (`TeamFactTool`)
 * för att svara på specifika frågor om ett fiktivt team, "Project Tone".
 *
 */

// Gå igenom denna fil ordentligt och förstå vad som händer.
// När du har ett bra grepp om det, testa att köra filen och se vad som händer.
// Därefter kan du börja implementera övningen.

//1. Skriv en bra beskrivning av detta verktyg.
const teamFactToolDescription = `Skriv en bra beskrivning av detta verktyg.`; //Används på rad 63

//2. Skapa en databas med fakta om Project Tone. (Eller annat valfritt projekt eller idé du har (kanske något till ditt eget projekt?))
const teamInfoDatabase = {
	team_lead: "Joel Janson är projektledare för Project Tone. Han är utbildad i systemutveckling och har tidigare arbetat med att utveckla en app för att hjälpa personer med att hitta lämpliga jobb.",
	project_deadline: "Vad är projektets deadline?",
	communication_channel: "Vilken kommunikationskanal används för Project Tone?",
	meeting_schedule: "Projektgruppen möts varje måndag klockan 10. Och varje fredag klockan 12.",
	favorite_snack: "Vilket är teamets favoritsnack?",
    programming_language: "Det är en app som utvecklas i Python och JavaScript.",
	// Lägg gärna till fler fakta!
};

//3. Får du tid över, implmentera gärna fler verktyg. Antingen TavilySearch eller något färdigt verktyg från LangChain.
// Eller ett eget verktyg som du skapar. (du kan se hur nedan på rad 44).

async function runTeamNavigatorAgent() {
	const llm = new ChatOpenAI({
		model: "gpt-4o-mini", // Byt gärna för att se skillnad
		temperature: 0.2, // Lower temperature for more predictable tool use
	});

	const teamFactTool = tool(
		async ({ topic }) => {
			console.log(`[TeamFactTool CALLED] Topic: ${topic}`);
			const fact = teamInfoDatabase[topic];

			if (fact) {
				return fact;
			}
			// Du kan också låta LLM:en formulera detta svar baserat på att verktyget inte returnerar något.
			// Men för tydlighetens skull kan verktyget själv svara.
			return "Jag är ledsen, jag har ingen specifik information om det ämnet för Project Tone.";
		},
		{
			name: "TeamFactTool",
			description: teamFactToolDescription,
			schema: z.object({
				topic: z
					.string()
					.describe(
						"Det specifika ämnet du vill ha information om (t.ex. 'programming_language', 'team_lead', 'project_deadline', 'communication_channel', 'meeting_schedule', 'favorite_snack'). Matcha nyckelorden i beskrivningen exakt."
					),
			}),
		}
	);

	//const tools = [teamFactTool]; 
    // Du kan lägga till TavilySearch här om du vill använda det.
	
	const searchTool = new TavilySearch({ maxResults: 5 });
	const tools = [teamFactTool, searchTool];

	const agentPrompt = `Dagens datum är ${new Date().toLocaleDateString(
		"sv-SE"
	)}.
Du är "Tone Assistant", en hjälpsam och lite finurlig AI för teamet 'Project Tone'.
Du har tillgång till ett specialverktyg som heter "TeamFactTool". Detta verktyg innehåller specifik, aktuell information om Project Tone (som programmeringsspråk, teamledare, deadlines, kommunikationskanaler, mötestider och till och med teamets favoritsnacks!).

Du ska ENDAST använda TeamFactTool om användaren ställer en fråga som tydligt handlar om en av dessa interna Project Tone-detaljer som beskrivs i verktygets beskrivning.
För allmänna kunskapsfrågor (t.ex. 'Vad är LangChain?', 'Vad är huvudstaden i Frankrike?'), ANVÄND INTE TeamFactTool utan search tool!
Om du blir tillfrågad om ett teamfakta och TeamFactTool indikerar att det inte har informationen (eller om frågan inte matchar verktygets syfte), meddela artigt att du inte har den specifika detaljen.
Var vänlig och koncis i dina svar. Ge bara det slutgiltiga svaret till användaren.`;

	const app = createReactAgent({
		llm,
		tools,
		prompt: agentPrompt,
	});

	// --- 3. Testa agenten ---
	const questions = [
		//"Vem är teamledare för Project Tone?",
		//"När är projektets deadline?",
		//"Berätta om teamets favoritsnacks.",
		"Vad är vädret i Kiruna idag?", // General question
		//"Vilket programmeringsspråk är Project Tone byggt i?", // Tool doesn't know
		//"Hur fungerar mötesschemat?", // Should use tool
	];

	for (const question of questions) {
		console.log(`\n--- Användarfråga: ${question} ---`);
		try {
			const result = await app.invoke({
				messages: [{ role: "user", content: question }],
			});
			// The result structure from createReactAgent is usually an object with 'messages' or 'output'
			// often the last message in result.messages is the AI's response.
			const lastMessage = result.messages[result.messages.length - 1];
			console.log(`Agentens svar: ${lastMessage.content}`);
		} catch (e) {
			console.error("Ett fel uppstod:", e);
		}
	}
}

runTeamNavigatorAgent();
