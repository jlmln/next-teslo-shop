import { dbUsers } from "@/database"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signIn } from 'next-auth/react';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@gmail.com'},
        password: { label: 'Contraseña', type: 'password', placeholder: 'correo@gmail.com'}
      },
      async authorize(credentials,req) {
        const user: any = await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password)

        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],

  pages:{
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session:{
    maxAge: 2592000,
    strategy: 'jwt' as const,
    updateAge: 86400
  },

  callbacks: {
    async jwt({token, account, user} :any){
      if(account){
        token.accessToken = account.access_token

        switch (account.type) {
          case 'credentials':
            token.user = user
            break;
          case 'oauth':

            break
          default:
            break;
        }
      }
      return token
    },

    async session({session, token, user}:any){
      
      session.accessToken = token.accessToken
      session.user = token.user as any

      return session
    }
  }
}

export default NextAuth(authOptions)