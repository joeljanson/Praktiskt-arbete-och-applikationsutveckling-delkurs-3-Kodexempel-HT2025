// demo-github-mcp-tonejs.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Hämtar README och docs från Tonejs/Tone.js via GitHub-MCP-servern
async function summarizeToneJS() {
	const resp = await client.responses.create({
		model: "gpt-5",
        instructions: `Du är en teknisk dokumentationsassistent. Använd GitHub-MCP-verktygen för att:
1) Hämta README.md från repo "Tonejs/Tone.js" med get_file_contents.
2) Om README hänvisar till en "docs/"-katalog, hämta huvudfiler där.
3) Plocka ut installationsinstruktioner (npm/yarn), importsyntax och ett minimalt exempel (skapa en synth och spela en ton).
4) Sammanfatta hur man använder Tone.js (t.ex. skapa en oscillator, använda transporten) och nämn var man hittar mer info (API-dokumentation, examples).
5) Ge en kort kodsnutt i JavaScript som demonstrerar installation och ett enkelt ljudexempel.`,
		input: [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: `Hur använder jag Tone.Transport() nu för tiden i tone.js?`,
                    },
                ],
            }
		],
		tools: [
			{
				type: "mcp",
				server_label: "github",
				server_url: "https://api.githubcopilot.com/mcp/",
				headers: {
					Authorization: `Bearer ${process.env.GITHUB_MCP_PAT}`, // PAT
					"X-MCP-Readonly": "true", // säkert läsläge
				},
				allowed_tools: [
					"get_file_contents",
					"get_latest_release",
					"list_tags",
					"list_commits",
					"search_code",
				],
				require_approval: "never",
			},
		],
		text: { verbosity: "medium" },
		reasoning: { effort: "minimal" },
	});

    console.log(JSON.stringify(resp, null, 2));
	console.log(resp.output_text);
}

summarizeToneJS().catch((err) => console.error(err?.response?.data ?? err));
