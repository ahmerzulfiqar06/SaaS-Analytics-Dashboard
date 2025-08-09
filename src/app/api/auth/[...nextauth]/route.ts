import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Export route handlers for App Router
const handler = NextAuth(authOptions);
export const { GET, POST } = handler;


