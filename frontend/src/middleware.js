import { NextRequest, NextResponse } from 'next/server'
import { getCookieServer } from '@/lib/cookieServer'
import { api } from '@/services/api'
import { headers } from 'next/headers'

export async function middleware (NextRequest){
    
    const { pathname } = NextRequest.nextUrl

    if(pathname.startsWith('/_next') || pathname === '/'){
        return NextResponse.next()
    }
    
    const token = await getCookieServer()

   if(pathname.startsWith('/dashboard')){
        if(!token){
            return NextResponse.redirect(new URL('/', NextRequest.url))
        }

        const isValid = await validateToken(token)
        
        if(!isValid){
            return NextResponse.redirect(new URL('/', NextRequest.url))
        }
    
   }
   
   return NextResponse.next()
}

async function validateToken(token) {
    if (!token) return false
        
    try {
        await api.get('/users/me', {
            headers: {
                authorization: `${token}`
            }
        })
        return true;
    } catch (err) {
        console.log(err)
        return false
    }
    
}