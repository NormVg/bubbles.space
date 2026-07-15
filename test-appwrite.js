const { Client, Storage, ID } = require('node-appwrite');
const client = new Client();
const storage = new Storage(client);
console.log(storage.createFile.toString());
