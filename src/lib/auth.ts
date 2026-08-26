import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        // 1. Find admin user in PostgreSQL database (table admin_users)
        let admin = null;
        try {
          admin = await prisma.adminUser.findUnique({
            where: { email: normalizedEmail },
          });

          // 2. If database has no admin users yet, automatically bootstrap the admin user in the database
          if (!admin) {
            const totalAdmins = await prisma.adminUser.count();
            if (totalAdmins === 0) {
              const passwordHash = await bcrypt.hash(credentials.password, 12);
              admin = await prisma.adminUser.create({
                data: {
                  email: normalizedEmail,
                  name: "Store Administrator",
                  passwordHash,
                },
              });
            }
          }
        } catch (dbError) {
          console.error("Database admin lookup error:", dbError);
        }

        if (!admin) {
          return null;
        }

        // 3. Verify bcrypt password hash stored in database
        const isValid = await bcrypt.compare(
          credentials.password,
          admin.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: "admin",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "casele-luxury-secure-secret-key-2026-doha",
};
