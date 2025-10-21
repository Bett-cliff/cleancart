import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Authenticate against your marketplace API
          const response = await fetch(`${process.env.MARKETPLACE_API_URL}/api/v1/vendors/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          if (!response.ok) {
            return null
          }

          const vendorData = await response.json()

          if (vendorData.success && vendorData.data) {
            return {
              id: vendorData.data.vendorId,
              email: vendorData.data.email,
              name: vendorData.data.businessName,
              role: 'vendor',
              businessName: vendorData.data.businessName,
              avatar: vendorData.data.avatar
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.businessName = user.businessName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.businessName = token.businessName as string
      }
      return session
    }
  },
  pages: {
    signIn: '/vendor/login',
    signOut: '/vendor/logout',
  }
}