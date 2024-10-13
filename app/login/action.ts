"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// Regex pour valider le mot de passe
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_:])(?=.{8,})/;

const SESSION_EXPIRATION = 5 * 60 * 1000; // 5 minutes en millisecondes

export async function login(prevState: any, formData: FormData) {
	const supabase = createClient();
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	console.log("Tentative de connexion pour:", email);

	// Vérification des champs manquants
	if (!email || !password) {
		return { error: "Email ou mot de passe manquant." };
	}

	// Validation du mot de passe
	if (!passwordRegex.test(password)) {
		return {
			error: "Le mot de passe est incomplet ou incorrect.",
		};
	}

	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("Erreur de connexion Supabase:", error);
			if (error.status === 400) {
				return { error: "Email ou mot de passe incorrect." };
			} else if (error.status === 422) {
				return { error: "Format d'email invalide." };
			} else {
				return {
					error: "Une erreur s'est produite lors de la connexion. Veuillez réessayer.",
				};
			}
		}

		if (!data.session) {
			console.error("Session non créée après connexion");
			return { error: "Impossible de créer une session" };
		}

		console.log("Connexion réussie pour:", email);

		// Définir l'expiration de la session
		const expirationTime = Date.now() + SESSION_EXPIRATION;
		cookies().set("sessionExpiration", expirationTime.toString(), {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: SESSION_EXPIRATION / 1000, // en secondes
		});

		// Si tout est OK, on continue la redirection
		revalidatePath("/");
		redirect("/dashboard"); // Rediriger vers le tableau de bord ou une autre page appropriée
	} catch (error) {
		console.error("Erreur inattendue lors de la connexion:", error);
		return {
			error: "Une erreur inattendue s'est produite. Veuillez réessayer.",
		};
	}
}
