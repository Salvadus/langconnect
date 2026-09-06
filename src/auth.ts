import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, account, profile }) {
      const googleSub =
        account?.providerAccountId ||
        (typeof profile?.sub === "string" ? profile.sub : undefined);
      if (googleSub) token.googleSub = googleSub;
      return token;
    },
    session({ session, token }) {
      const googleSub =
        typeof token.googleSub === "string" ? token.googleSub : "";
      const tokenSub = typeof token.sub === "string" ? token.sub : "";
      return {
        ...session,
        user: {
          ...session.user,
          id: googleSub || tokenSub,
        },
      };
    },
    authorized({ auth: session, request }) {
      const path = request.nextUrl.pathname;
      const isPlataforma = path.startsWith("/plataforma");
      if (isPlataforma) return Boolean(session?.user?.email);
      return true;
    },
  },
});
