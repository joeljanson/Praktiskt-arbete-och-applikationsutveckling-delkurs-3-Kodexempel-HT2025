import { tool } from '@openai/agents';
import { z } from 'zod';

export const getWeather = tool({
  name: 'get_weather',
  description: 'Return a short weather string for a city',
  parameters: z.object({ city: z.string() }),
  async execute({ city }) {
   //Här skulle vi anropa ett väder API.
    return `The weather in ${city} is sunny.`; 
  },
});