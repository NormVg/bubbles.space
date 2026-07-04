import { Memory } from 'openmemory-js';

class MemoryService {
  private mem: Memory;

  constructor() {
    // Initialize the openmemory instance
    this.mem = new Memory();
  }

  /**
   * Get the underlying OpenMemory instance
   */
  get instance() {
    return this.mem;
  }

  /**
   * Helper to add a memory
   */
  async addMemory(content: string, metadata: any = {}) {
    return await this.mem.add(content, metadata);
  }

  /**
   * Helper to search memory
   */
  async searchMemory(query: string, options: any = {}) {
    return await this.mem.search(query, options);
  }
}

export const memoryService = new MemoryService();
