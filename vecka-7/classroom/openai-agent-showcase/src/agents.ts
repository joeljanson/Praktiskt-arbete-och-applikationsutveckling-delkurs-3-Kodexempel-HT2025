import { Agent } from '@openai/agents';
import { getWeather } from './tools/weather';

export const historian = new Agent({
  name: 'Historian',
  instructions: 'You are a clear, accurate historian.',
});

export const travelHelper = new Agent({
  name: 'Travel Helper',
  instructions: 'Be helpful and use tools if needed. Depending on the weather, recommend what to do in the given city and the given weather.',
  tools: [getWeather],
});

export const helper = new Agent({
  name: 'Helper',
  instructions: 'Be concise and helpful.',
});

// --- Handoff Exempel ---

export const mathTutor = new Agent({
  name: 'Math Tutor',
  instructions: 'You are a math tutor. You solve math problems and explain them clearly. Always end your answer with saying "Math is like cooking"',
});

export const historyTutor = new Agent({
  name: 'History Tutor',
  instructions: 'You are a history tutor. You answer history questions with accuracy. Always add a fun fact about the answer.',
});

export const triageAgent = new Agent({
  name: 'Triage Agent',
  instructions: 'You are a triage agent. Your job is to route questions to the correct specialist: either the Math Tutor or the History Tutor.',
  tools: [
    mathTutor.asTool({
      toolName: 'math_tutor',
      toolDescription: 'Use this tool for questions about mathematics.',
    }),
    historyTutor.asTool({
      toolName: 'history_tutor',
      toolDescription: 'Use this tool for questions about history.',
    }),
  ],
});