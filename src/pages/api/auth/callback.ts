import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '@/lib/supabase'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createSupabaseServerClient(request, cookies)
    await supabase.auth.exchangeCodeForSession(code)
  }

  return redirect('/')
}
