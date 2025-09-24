//https://platform.openai.com/docs/guides/function-calling?api-mode=responses#additional-configurations:~:text=Take%20a%20look%20at%20this%20example%20or%20generate,Generate
const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function retrieveDataBetweenDates(start_date, end_date) {
	//const { data, error } = await supabase.from("user_data").select("*").lte("created_at", end_date).gte("created_at", start_date);
	return `Entry 1 (2025-04-20): Today was a good day. I had lunch with my friend Julia. We went to a delicious restaurant called "The Gourmet".
            Entry 2 (2025-04-17): The sun was shining today and it was beautiful, the trees are starting to blossom.
            Entry 3 (2025-04-19): I'm having a great time right now, birds are singing and I can feel spring is coming!`;
}

const tools = [
	{
		type: "function",
		name: "retrieveDataBetweenDates",
		description:
			"This function calls Supabase and fetches information between the two dates.",
		strict: true,
		parameters: {
			type: "object",
			required: ["start_date", "end_date"],
			properties: {
				start_date: {
					type: "string",
					description:
						"The start date for the data retrieval in ISO format (yyyy-mm-dd)",
				},
				end_date: {
					type: "string",
					description:
						"The end date for the data retrieval in ISO format (yyyy-mm-dd)",
				},
			},
			additionalProperties: false,
		},
	},
];

const input = [
	{
		role: "user",
		content: "How has my last week been?",
	},
];

async function callFunction(name, args) {
	if (name === "retrieveDataBetweenDates") {
		if (!args.start_date || !args.end_date) {
			throw new Error("start_date and end_date are required");
		}
		const data = await retrieveDataBetweenDates(args.start_date, args.end_date);
		console.log(data);
		return data;
	}
}

async function functionCallingExample() {
	const systemInstruction = `Todays date is ${
		new Date().toISOString().split("T")[0]
	}. 
    You are a helpful assistant that can retrieve by using the tools that are provided
    When giving the final answer, don't list the dates, answer in a more compelling encouraging way.`;

	const response = await openai.responses.create({
		model: "gpt-4o-mini",
		input: input,
		instructions: systemInstruction,
		tools: tools,
	});

	for (const toolCall of response.output) {
		if (toolCall.type === "function_call") {
			const name = toolCall.name;
			const args = JSON.parse(toolCall.arguments);
			const result = await callFunction(name, args);
			input.push({
				type: "function_call_output",
				call_id: toolCall.call_id,
				output: result,
			});
		}
	}

	const secondResponse = await openai.responses.create({
		model: "gpt-4o-mini",
		input: input,
		instructions: systemInstruction,
		previous_response_id: response.id,
	});

	console.log(secondResponse.output_text);

	const parsedResponse = await structuredOutputExample(input, response.id);
	console.log(parsedResponse);
}

functionCallingExample();

const responseSchema = {
	format: {
		type: "json_schema",
		name: "response_schema",
		schema: {
			type: "object",
			properties: {
				responses: {
					type: "array",
					items: {
						type: "object",
						properties: {
							date: {
								type: "string",
								description: "The date when the response was generated.",
							},
							content: {
								type: "string",
								description: "The text content that was provided.",
							},
							mood_estimation: {
								type: "string",
								description:
									"An estimation of the mood based on the text content.",
							},
						},
						required: ["date", "content", "mood_estimation"],
						additionalProperties: false,
					},
				},
			},
			required: ["responses"],
			additionalProperties: false,
		},
		strict: true,
	},
};

async function structuredOutputExample(input, previousResponseId) {
	const structuredResponse = await openai.responses.create({
		model: "gpt-4o-mini",
		input: input,
		previous_response_id: previousResponseId,
		text: responseSchema,
	});

	const parsedResponse = JSON.parse(structuredResponse.output_text);
	console.log(parsedResponse);

	return parsedResponse;
}
