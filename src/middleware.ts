import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 1. Capture referral code or clear if coming from ads
    const { searchParams } = new URL(request.url)
    const ref = searchParams.get('ref')
    const utmSource = searchParams.get('utm_source')

    // If coming from an ad (UTM source present), clear any existing affiliate cookies
    // This ensures ad traffic is not misattributed to a partner
    if (utmSource) {
        response.cookies.delete('affiliate_id')
        response.cookies.delete('affiliate_source')
    } else if (ref) {
        // Set cookie that expires in 30 days
        response.cookies.set('affiliate_id', ref, {
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        })
    }

    // Capture source (QR, Link, Social) if not already cleared by UTM
    const src = searchParams.get('src')
    if (src && !utmSource) {
        response.cookies.set('affiliate_source', src, {
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        })
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    await supabase.auth.getUser()

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
