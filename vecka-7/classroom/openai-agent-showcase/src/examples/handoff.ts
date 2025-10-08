import { run } from '@openai/agents';
import { triageAgent } from '../agents';

export async function runHandoffExample() {
  console.log('Running Handoff Example...');

  let question = 'What is the Pythagorean theorem?';
  console.log(`User Question: ${question}`);
  let result = await run(triageAgent, question);
  console.log('Agent Response:', result.finalOutput);

  question = 'When did the Renaissance begin?';
  console.log(`User Question: ${question}`);
  result = await run(triageAgent, question);
  console.log('Agent Response:', result.finalOutput);
}