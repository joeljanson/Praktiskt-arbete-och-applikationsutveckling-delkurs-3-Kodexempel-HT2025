import { run, system, user, assistant } from '@openai/agents';
import { helper } from '../agents';


export async function runConversationExample() {
  console.log('\nRunning Stateful Conversation Example...');

  const history = [
    user('Help me plan a 1-day trip to Uppsala.'),
    assistant('Sure! Do you prefer museums or outdoors?'),
    user('Outdoors.'),
  ];

  const result = await run(helper, history);
  console.log('Agent Response:', result.finalOutput);
}