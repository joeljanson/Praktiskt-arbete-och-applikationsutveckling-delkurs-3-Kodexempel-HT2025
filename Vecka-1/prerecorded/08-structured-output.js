import OpenAI from 'openai';
import { z } from 'zod';
import { zodTextFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/*
Vi kan använda oss av json schema för att strukturera våra svar. Precis som vi gjort tidigare.
*/

async function jsonSchemaExample() {
    const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: [
            { role: "system", content: "Extract the event information." },
            {
                role: "user",
                content: "Alice and Bob are going to a science fair on Friday.",
            },
        ],
        text: {
            format: {
                type: "json_schema",
                name: "calendar_event",
                schema: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        date: { type: "string" },
                        participants: { type: "array", items: { type: "string" } },
                    },
                    required: ["name", "date", "participants"],
                    additionalProperties: false,
                },
                strict: true,
            }
        },
    });

    const event = JSON.parse(response.output_text);
    console.log(event);
}

/*
Vi kan också använda oss av zod för att validera strukturen av våra svar.
Det kan ibland bli lite tydligare tycker jag att kunna definiera object som
exemplet nedan med CalendarEventSchema. Snarare än exemplet ovan med json schema.
*/

async function zodValidationExample() {
    const CalendarEventSchema = z.object({
        name: z.string(),
        date: z.string(),
        participants: z.array(z.string())
    });

    const json = zodTextFormat(CalendarEventSchema, "calendarEvent");
    console.log("json: ", json);

    const response = await client.responses.create({
			model: "gpt-4o",
			input: "Alice and Bob are going to a science fair on Friday",
			instructions: "Extract the event information",
			text: {
				format: json,
			},
		});

    const parsedEvent = JSON.parse(response.output_text);
    console.log("parsedEvent: ", parsedEvent);
    const validatedEvent = CalendarEventSchema.parse(parsedEvent);

    console.log("typeof validatedEvent: ", typeof validatedEvent);
    console.log("validatedEvent: ", JSON.stringify(validatedEvent, null, 2));
}

// Run all examples
async function runAllExamples() {
    console.log("\n=== JSON Schema Example ===");
    //await jsonSchemaExample();
    
    console.log("\n=== Zod Validation Example ===");
    await zodValidationExample();
}

// Uncomment to run all examples
//runAllExamples(); 