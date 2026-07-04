import { auth } from "../../utils/auth";
import { toNodeHandler } from "better-auth/node";

export default defineEventHandler((event) => {
  return toNodeHandler(auth.handler)(event.node.req, event.node.res);
});
