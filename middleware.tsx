import { NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from './app/i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lng*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|\\.jpg|\\.jpeg|\\.png|\\.gif|\\.svg|\\.ico).*)']
}

export function middleware(req) {
  let lng
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName).value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  // Redirect if lng in path is not supported
  const staticExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.css', '.js']; // Add any other extensions you need.

  if (
    !languages.some(lng => req.nextUrl.pathname.startsWith(`/${lng}`)) &&
    !req.nextUrl.pathname.startsWith('/_next') &&
    !staticExtensions.some(ext => req.nextUrl.pathname.endsWith(ext))
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url));
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer'))
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return NextResponse.next()
}