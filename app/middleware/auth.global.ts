import { authClient } from '~/utils/auth-client';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data } = await authClient.getSession({
    fetchOptions: {
      headers: import.meta.server ? useRequestHeaders(['cookie']) as HeadersInit : undefined,
    }
  });

  if (to.path.startsWith('/app')) {
    if (!data) {
      return navigateTo('/');
    }
  } else if (to.path === '/') {
    if (data) {
      return navigateTo('/app');
    }
  }
});
