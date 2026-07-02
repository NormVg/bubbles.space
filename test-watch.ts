import { ref, watch, isRef } from 'vue';
import { createAuthClient } from "better-auth/vue";

const client = createAuthClient();
const session = client.useSession();

console.log("Is session ref?", isRef(session));
console.log("session keys:", Object.keys(session));
if (isRef(session)) {
    console.log("session.value keys:", Object.keys(session.value));
}
