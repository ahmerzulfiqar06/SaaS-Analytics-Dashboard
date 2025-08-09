import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "database" },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER as string | undefined, // optional SMTP
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        // In development we just log the magic link
        console.log("Login link:", url);
      },
    }),
  ],
  pages: {},
  callbacks: {
    async session({ session, user }) {
      (session as Session & { userId: string }).userId = user.id;
      return session;
    },
  },
};

export const { handlers: authHandlers, auth, signIn, signOut } = NextAuth(
  authOptions,
);


