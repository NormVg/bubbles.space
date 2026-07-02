import { authClient } from '~/utils/auth-client';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path.startsWith('/app')) {
    if (import.meta.client) {
      const { data } = await authClient.getSession();
      if (!data) {
        return navigateTo('/');
      }
    }
  } else if (to.path === '/') {
    if (import.meta.client) {
      const { data } = await authClient.getSession();
      if (data) {
        return navigateTo('/app');
      }
    }
  }
});
