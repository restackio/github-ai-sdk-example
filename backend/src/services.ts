import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { githubService } from '@restackio/integrations-github';
import { githubTaskQueue } from '@restackio/integrations-github/taskQueue';

import { client } from './client.js';
import { workflowSendEvent } from './functions/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function services() {
  const workflowsPath = resolve(__dirname, './workflows');

  try {
    await Promise.all([
      client.startService({
        workflowsPath,
        functions: {
          workflowSendEvent,
        },
        taskQueue: githubTaskQueue,
      }),
      githubService({
        client,
        options: {
          rateLimit: 100,
        },
      }),
    ]);
    console.log('Services running successfully.');
  } catch (e) {
    console.error('Failed to run worker', e);
  }
}
