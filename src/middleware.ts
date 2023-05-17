import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

const rejectedApiAdmin = (session:any,validRoles: string[]) => {
  if(!session || !validRoles.includes(session.user.role)){
    return new Response( JSON.stringify({ message: 'No autorizado'}),{
      status: 401,
      headers: {'Content-Type':'application/json'}
    })
  }

  return NextResponse.next()
}

export async function middleware(req: NextRequest ,ev: NextFetchEvent) {
    const session : any = await getToken({req,secret: process.env.JWT_SECRET_SEED})
    const requestedPage = req.nextUrl.pathname
    const validRoles = ['admin','super-user','SEO']

    switch (requestedPage) {
      case 'admin':
        if(session && validRoles.includes(session.user.role)){ return NextResponse.next() }
    
        if(session && !validRoles.includes(session.user.role)){ return NextResponse.redirect(new URL(`/`,req.url))  }

      case '/api/admin/dashboard':
        return rejectedApiAdmin(session,validRoles)
        
      case '/api/admin/users':
        return rejectedApiAdmin(session,validRoles)
        
      case '/api/admin/products':
        return rejectedApiAdmin(session,validRoles)

      default:
        if(session){ return NextResponse.next() }
        return NextResponse.redirect(new URL(`/auth/login?p=${requestedPage}`,req.url))
    }  
}

export const config = {
  matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
}