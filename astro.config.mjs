import { defineConfig } from 'astro/config'
import auth from 'auth-astro'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'

import db from '@astrojs/db'

// https://astro.build/config
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  integrations: [react(), auth(), db()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
})
