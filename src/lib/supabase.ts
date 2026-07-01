import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import type { AstroCookies } from 'astro'

export function createSupabaseServerClient(request: Request, cookies: AstroCookies) {
  return createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '').map(
            ({ name, value }) => ({ name, value: value ?? '' })
          )
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies.set(name, value, options)
          )
        },
      },
    }
  )
}

export async function getUser(request: Request, cookies: AstroCookies) {
  const supabase = createSupabaseServerClient(request, cookies)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
