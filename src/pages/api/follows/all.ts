import type { APIRoute } from 'astro'
import { getUser, createSupabaseServerClient } from '@/lib/supabase'

export const GET: APIRoute = async ({ request, cookies }) => {
  const user = await getUser(request, cookies)

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createSupabaseServerClient(request, cookies)

  try {
    const { data, error } = await supabase
      .from('follow')
      .select()
      .order('created_at', { ascending: false })

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}
