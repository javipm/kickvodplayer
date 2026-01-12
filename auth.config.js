import Twitch from '@auth/core/providers/twitch'
import { defineConfig } from 'auth-astro'

export default defineConfig({
  providers: [
    Twitch({
      clientId: import.meta.env.TWITCH_CLIENT_ID,
      clientSecret: import.meta.env.TWITCH_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid user:read:email',
        },
      },
      client: {
        token_endpoint_auth_method: 'client_secret_post',
      },
    }),
  ],
})
