import { eveChannel } from "eve/channels/eve";
import { localDev, type AuthFn } from "eve/channels/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../server/db/schema";

/**
 * Initialize a standalone Better Auth instance for the Eve runtime.
 * Eve runs as a separate Vercel service, so it cannot import from
 * server/utils/auth.ts (that's Nuxt's runtime). We create a minimal
 * auth instance here that shares the same DB and schema, so it can
 * validate the same session cookies.
 */
function createAuth() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in Eve runtime");
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, { schema });

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: { ...schema },
    }),
    emailAndPassword: { enabled: false },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    user: {
      additionalFields: {
        systemPrompt: { type: "string" },
        aboutMe: { type: "string" },
      },
    },
  });
}

let authInstance: ReturnType<typeof createAuth> | null = null;

function getAuth() {
  if (!authInstance) {
    authInstance = createAuth();
  }
  return authInstance;
}

/**
 * Custom AuthFn that validates the user's Better Auth session cookie.
 * Returns a user principal with the real userId as principalId.
 * This is what populates ctx.session.auth.current in tools.
 */
function betterAuthSession(): AuthFn<Request> {
  return async (request) => {
    try {
      const auth = getAuth();
      const session = await auth.api.getSession({ headers: request.headers });

      if (!session?.user?.id) {
        return null;
      }

      return {
        authenticator: "better-auth",
        principalId: session.user.id,
        principalType: "user" as const,
        attributes: {
          email: session.user.email,
          name: session.user.name,
        },
      };
    } catch {
      return null;
    }
  };
}

export default eveChannel({
  auth: [betterAuthSession(), localDev()],
});
