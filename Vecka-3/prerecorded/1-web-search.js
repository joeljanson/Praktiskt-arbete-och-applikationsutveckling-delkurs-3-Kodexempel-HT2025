//https://platform.openai.com/docs/guides/tools-web-search?api-mode=responses
//
/*

Pricing: https://platform.openai.com/docs/pricing#built-in-tools

When displaying web results or information contained in web results to end users, 
inline citations must be made clearly visible and clickable in your user interface.


https://platform.openai.com/docs/guides/your-data

*/

const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


async function basicWebSearch() {
    const response = await openai.responses.create({
			model: "gpt-4o-mini",
            instructions: "Du är en nyhetsjänare som skapar nyheter om världen runt omkring dig. Din uppgift är att hitta nyheter som är relevanta för din användare och presentera dem på ett lättläst sätt. Inkludera aldrig länkar till nyheterna i dina svar.",
			tools: [
				{
					type: "web_search_preview",
					search_context_size: "high",
                    user_location: {
                        type: "approximate",
                        country: "SE",
                        region: "Stockholm",
                        city: "Stockholm",
                    }
				},
			],
			input: "Kan du ge mig en bra nyhet från dagens datum?",
		});
    /* for (const output of response.output) {
        if (output.type === "web_search_preview") {
            console.log("Web search preview:", output.web_search_preview);
        } 
    } */

    //console.log(response.output[1].content[0].annotations[0].url);
    console.log("Response:", JSON.stringify(response, null, 2));
    console.log("Output:", response.output_text);
}

basicWebSearch();
