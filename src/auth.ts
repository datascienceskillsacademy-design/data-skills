import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      profileCompleted: boolean;
    };
  }
}

function isProfileComplete(user: {
  name: string | null;
  phone: string | null;
  designation: string | null;
  organization: string | null;
}) {
  return !!(user.name && user.phone && user.designation && user.organization);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.hashedPassword) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as Role;
      }
      // A client called useSession().update() — e.g. after the account-settings
      // form saves a new name/email. Pull the latest values straight from the DB.
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { name: true, email: true },
        });
        if (dbUser) {
          token.name = dbUser.name;
          token.email = dbUser.email;
        }
      }
      // Re-check the DB until the profile is complete (or role is missing),
      // so completing the profile takes effect on the next request without
      // forcing a re-login. Completed profiles are cached in the token.
      if (token.id && (!token.role || token.profileCompleted !== true)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            role: true,
            name: true,
            phone: true,
            designation: true,
            organization: true,
          },
        });
        if (dbUser) {
          token.role = dbUser.role as Role;
          // Only students are required to complete the extended profile
          token.profileCompleted =
            dbUser.role !== "STUDENT" || isProfileComplete(dbUser);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.profileCompleted = token.profileCompleted === true;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "STUDENT" },
      });
    },
  },
});
