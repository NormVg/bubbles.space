import fetch from 'node-fetch';

async function run() {
  const url = 'http://localhost:3000/api/memory';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-secret': 'eve-bubbles-secret',
      'x-user-id': 'test-user-id'
    },
    body: JSON.stringify({
      path: 'working/test.md',
      title: 'Test',
      content: 'Hello World'
    })
  });

  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Body:', text);
}

run();
