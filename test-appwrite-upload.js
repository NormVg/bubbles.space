import { Client, Storage, ID, InputFile } from 'node-appwrite';

const endpoint = 'https://cloud.appwrite.io/v1'; // Trying default first
const projectId = '6a566dac001ba54c7c14';
const apiKey = 'standard_c8ebddd8acdd3314be480eac91ee041471e09d507448baa3a0ba6d9030a228ca356cf903cd8fd063b4bf7bf0184f0da746a1f5dc599defbfc05835d10df485efb89e0dbf0f2d4193d26d84421b2925c606acf27ed59f0036b0083bdaa5f28c1779d311cba5d6c4222691cfd96fdc34fc59711adf5e74f79cf3c3aaf70e028545';
const bucketId = '6a568068000e8c38fa6d';

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const storage = new Storage(client);

async function run() {
    try {
        const buffer = Buffer.from('Hello world');
        const file = File ? new File([buffer], 'test.txt', { type: 'text/plain' }) : null;
        
        console.log('Attempting upload...');
        const res = await storage.createFile(
            bucketId,
            ID.unique(),
            file // We used standard File in our code!
        );
        console.log('Success!', res.$id);
    } catch (e) {
        console.error('Error:', e.message);
    }
}
run();
