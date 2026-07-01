import type { APIRoute } from 'astro'
import { getUser, createSupabaseServerClient } from '@/lib/supabase'

export const GET: APIRoute = async ({ params, request, cookies }) => {
  const user = await getUser(request, cookies)

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { streamer } = params
  if (!streamer) {
    return new Response('Missing streamer', { status: 400 })
  }

  const supabase = createSupabaseServerClient(request, cookies)

  try {
    await supabase.from('follow').delete().eq('streamer', streamer).throwOnError()
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}
