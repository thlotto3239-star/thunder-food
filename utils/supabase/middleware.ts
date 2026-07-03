import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  const isPublicPath = path === '/login' || path === '/register' || path === '/' || path === '/forgot-password' || path === '/terms' || path.startsWith('/auth')
  
  // If user is not logged in and tries to access protected route
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in
  if (user) {
    const role = user.user_metadata?.role as string || 'customer'
    
    // Redirect away from login/register if already logged in
    if (path === '/login' || path === '/register') {
      const url = request.nextUrl.clone()
      url.pathname = `/${role}`
      return NextResponse.redirect(url)
    }

    // Strict Role Isolation Protection
    // 1. Admin MUST stay in /admin
    if (role === 'admin' && !path.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
    
    // 2. Restaurant MUST stay in /restaurant
    if (role === 'restaurant' && !path.startsWith('/restaurant')) {
      const url = request.nextUrl.clone()
      url.pathname = '/restaurant'
      return NextResponse.redirect(url)
    }
    
    // 3. Rider MUST stay in /rider
    if (role === 'rider' && !path.startsWith('/rider')) {
      const url = request.nextUrl.clone()
      url.pathname = '/rider'
      return NextResponse.redirect(url)
    }
    
    // 4. Customer CANNOT access /admin, /restaurant, or /rider
    if (role === 'customer' && (path.startsWith('/admin') || path.startsWith('/restaurant') || path.startsWith('/rider'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
