import OpenAI from "openai";

import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function webSearch() {
    const response = await client.responses.create({
			model: "gpt-4o-mini",
			tools: [{ type: "web_search_preview" }],
			input: "What are the best restaurants in Stockholm if you like music?",
		});

	//console.log(response);
	//console.log(response.output_text);
    //console.log(response.output[1].content[0]);
	//console.log(response.output[1].content[0].annotations);
}

async function webSearchWithUserLocation() {
	const response = await client.responses.create({
		model: "gpt-4o-mini",
		tools: [{ 
            type: "web_search_preview",
            /* user_location: {
				type: "approximate",
				country: "SE",
				city: "Stockholm",
			}, */
		}],
		input: "What are the best restaurants in Södermalm if you like music?",
	});

	//console.log(response);
	console.log(response.output_text);
	//console.log(response.output[1].content[0]);
	//console.log(response.output[1].content[0].annotations);
}

//webSearch();
webSearchWithUserLocation();
