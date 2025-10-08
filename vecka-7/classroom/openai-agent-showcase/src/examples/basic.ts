import { run } from '@openai/agents';
import { historian } from '../agents';

export async function runBasicExample() {
  console.log('\nRunning Basic Historian Agent Example...');
  const result = await run(historian, 'When did sharks first appear?');
  console.log('Agent Response:', result.finalOutput);
}