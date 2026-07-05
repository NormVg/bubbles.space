const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const chat = await prisma.chat.findUnique({
    where: { id: "6a25b720-9a26-4e9a-b7b6-ee9954df0306" }
  });
  if (!chat) return console.log('Chat not found');
  const detail = JSON.parse(chat.detail);
  console.log(JSON.stringify(detail.events.map(e => ({ type: e.type, step: e.step, role: e.role, text: e.content?.[0]?.text?.substring(0, 50), tool: e.content?.[0]?.name })), null, 2));
}
run().catch(console.error);
