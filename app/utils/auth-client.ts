import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

export const { signIn, signOut, useSession } = authClient;
