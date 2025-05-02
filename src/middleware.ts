import { NextRequest, NextResponse } from 'next/server'
import { env } from './env'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Forward headers for client IP
  const forwardedHeaders = {
    'X-Forwarded-For': req.headers.get('x-forwarded-for') || '',
    'X-Real-IP': req.headers.get('x-real-ip') || '',
    'cf-connecting-ip': req.headers.get('cf-connecting-ip') || '',
  }

  console.log('all', [...req.headers.entries()])

  if (url.pathname.startsWith('/script.js') || url.pathname.startsWith('/api')) {
    console.log(url.pathname)
    console.log('forwardedHeaders ', forwardedHeaders)

    const destination = url.pathname.startsWith('/script.js')
      ? `${env.UMAMI_URI}/script.js`
      : `${env.UMAMI_URI}${url.pathname}`

    return NextResponse.rewrite(destination, {
      headers: forwardedHeaders,
    })
  }

  return NextResponse.next()
}
