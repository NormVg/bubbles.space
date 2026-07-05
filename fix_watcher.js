const fs = require('fs');
const file = 'app/stores/widgets.ts';
let code = fs.readFileSync(file, 'utf8');

// Find the reloadFromServer function
code = code.replace(/nextTick\(\(\) => \{\n\s+isReloadingFromServer = false\n\s+\}\)/, 
`// Wait for Vue's microtask queue (watchers) and DOM updates to fully settle
        setTimeout(() => {
          isReloadingFromServer = false
        }, 100)`);

fs.writeFileSync(file, code);
