import { MemoryService } from './server/services/memory.service.js';

async function main() {
  console.log("Testing memory store...");
  try {
    const result = await MemoryService.storeMemory('test_user_id', 'working/test', {
      title: 'test memory',
      content: 'this is a test memory content',
      type: 'fact'
    });
    console.log("Success:", result);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
