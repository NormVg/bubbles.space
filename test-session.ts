import { createAuthClient } from "better-auth/vue";
const client = createAuthClient();
const session = client.useSession();
console.log('is session a ref?', !!session.__v_isRef);
console.log('is session.value.data a ref?', !!session.value.data?.__v_isRef);
console.log('keys in session.value:', Object.keys(session.value));
