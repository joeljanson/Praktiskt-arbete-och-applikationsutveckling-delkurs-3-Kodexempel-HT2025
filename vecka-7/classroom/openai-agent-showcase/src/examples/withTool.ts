import { run } from '@openai/agents';
import { travelHelper } from '../agents';

export async function runToolExample() {
  console.log('\nRunning Agent with Tool Example...');
  const result = await run(travelHelper, 'What’s the weather like in Stockholm?');
  console.log('Agent Response:', result.finalOutput);
}