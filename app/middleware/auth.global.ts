import { authClient } from '~/utils/auth-client';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data } = await authClient.getSession({
    fetchOptions: {
      headers: import.meta.server ? useRequestHeaders(['cookie']) as HeadersInit : undefined,
    }
  });

  const config = useRuntimeConfig();

  if (to.path.startsWith('/app')) {
    if (!data) {
      return navigateTo('/');
    }

    // Waitlist check
    if (config.public.appLocked) {
      const email = data.user.email;
      const whitelist = config.public.whitelistedEmails.split(',').map(e => e.trim());
      
      if (!whitelist.includes(email)) {
        return navigateTo('/waitlist');
      }
    }
  } else if (to.path === '/') {
    if (data) {
      // If locked and not whitelisted, go to waitlist, otherwise go to app
      if (config.public.appLocked) {
        const email = data.user.email;
        const whitelist = config.public.whitelistedEmails.split(',').map(e => e.trim());
        if (!whitelist.includes(email)) {
          return navigateTo('/waitlist');
        }
      }
      return navigateTo('/app');
    }
  } else if (to.path === '/waitlist') {
    if (!data) {
      return navigateTo('/');
    }
    // If they are on waitlist but shouldn't be (unlocked or whitelisted), send to app
    if (!config.public.appLocked) {
      return navigateTo('/app');
    } else {
      const email = data.user.email;
      const whitelist = config.public.whitelistedEmails.split(',').map(e => e.trim());
      if (whitelist.includes(email)) {
        return navigateTo('/app');
      }
    }
  }
});
