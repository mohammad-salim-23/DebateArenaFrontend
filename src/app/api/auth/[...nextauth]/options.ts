/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import axios from "axios";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    token: string;
  }
  interface Session {
    user: User;
    token: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { success, data, message } = res.data;

          if (!success || !data?.token) {
            throw new Error(message || "Invalid credentials");
          }

          const user = data.user;

          return {
            id: user.id, 
            username: user.username,
            email: user.email,
            role: user.role,
            token: data.token,
          };
        } catch (error: any) {
          console.error("Login error:", error?.response?.data || error.message);
          throw new Error(
            error?.response?.data?.message || "Invalid email or password"
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token; 
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          role: token.role as string,
          token: token.token as string,
        };
        session.token = token.token as string; 
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign-in",
  },
};
