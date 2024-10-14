// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseClient } from "@/utils/supabaseClient";

export default NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const { email, password } = credentials;

				// Connexion via Supabase avec email et mot de passe
				const { data, error } =
					await supabaseClient.auth.signInWithPassword({
						email,
						password,
					});

				if (error || !data.user) {
					throw new Error("Invalid email or password");
				}

				// Retourne les informations utilisateur si la connexion réussit
				return {
					id: data.user.id,
					email: data.user.email,
				};
			},
		}),
	],
	pages: {
		signIn: "/login", // Page de connexion personnalisée
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.id = token.id;
			}
			return session;
		},
	},
});
