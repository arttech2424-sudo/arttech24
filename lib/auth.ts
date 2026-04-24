import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((v) => v.trim().toLowerCase())
  .filter(Boolean);

const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  callbacks: {
    signIn({ user }: { user: { email?: string | null } }) {
      if (!adminEmails.length) {
        return true;
      }
      const userEmail = user?.email?.toLowerCase();
      return !!userEmail && adminEmails.includes(userEmail);
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};
