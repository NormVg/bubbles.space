import { MemoryService } from './server/services/memory.service';

async function run() {
  try {
    const mem = await MemoryService.storeMemory('test-user-id', 'working/test.md', {
      title: 'Test',
      content: 'Hello World'
    });
    console.log('Success:', mem);
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit(0);
}

run();
