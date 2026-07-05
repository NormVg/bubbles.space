const fs = require('fs');

// Patch useRealtimeSync.ts
let syncFile = 'app/composables/useRealtimeSync.ts';
let syncCode = fs.readFileSync(syncFile, 'utf8');

syncCode = syncCode.replace(/console\.log\('Received remote widget sync', msg\.data\)/, 
`console.log('[Ably] Received remote widget sync', msg.data, 'localId:', localInstanceId)`);

fs.writeFileSync(syncFile, syncCode);

// Patch widgets.ts
let widgetFile = 'app/stores/widgets.ts';
let widgetCode = fs.readFileSync(widgetFile, 'utf8');

// Add source to reloadFromServer
widgetCode = widgetCode.replace(/const reloadFromServer = async \(\) => \{/, 'const reloadFromServer = async (source = "unknown") => {\n    console.log(`[Widgets] reloadFromServer triggered by: ${source}`);');

// Find where it's exported and add source
widgetCode = widgetCode.replace(/void widgetStore\.reloadFromServer\(\)/g, 'void widgetStore.reloadFromServer("ably")');
fs.writeFileSync(widgetFile, widgetCode);
