import * as dotenv from 'dotenv';
// Load environment variables from a .env file into process.env
dotenv.config();

import { runBasicExample } from './examples/basic';
import { runToolExample } from './examples/withTool';
import { runConversationExample } from './examples/convo';
import { runHandoffExample } from './examples/handoff';
import { runRealHandoffExample } from './examples/realHandoff';


async function main() {
  // Run each example sequentially
  //await runBasicExample();
  //await runToolExample();
  //await runConversationExample();
  //await runHandoffExample();
  await runRealHandoffExample();
}


main().catch(console.error);