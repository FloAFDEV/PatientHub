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
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email et mot de passe requis");
				}

				const { data, error } =
					await supabaseClient.auth.signInWithPassword({
						email: credentials.email,
						password: credentials.password,
					});

				if (error) {
					console.error("Erreur d'authentification:", error.message);
					throw new Error("Identifiants invalides");
				}

				if (!data.user) {
					throw new Error("Aucun utilisateur trouvé");
				}

				// Récupérer les informations supplémentaires de l'utilisateur depuis votre table users
				const { data: userData, error: userError } =
					await supabaseClient
						.from("users")
						.select("*")
						.eq("id", data.user.id)
						.single();

				if (userError) {
					console.error(
						"Erreur lors de la récupération des données utilisateur:",
						userError.message
					);
					throw new Error(
						"Erreur lors de la récupération des données utilisateur"
					);
				}

				return {
					id: data.user.id,
					email: data.user.email,
					name: userData.name,
					role: userData.role,
					osteopathId: userData.osteopath_id,
				};
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.osteopathId = user.osteopathId;
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.user.osteopathId = token.osteopathId;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
});
