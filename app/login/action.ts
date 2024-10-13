"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Regex pour valider le mot de passe
const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function login(formData: FormData) {
	const supabase = createClient();
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	// Vérification des champs manquants
	if (!email || !password) {
		return { error: "Email ou mot de passe manquant." }; // Retourne l'erreur sans redirection
	}

	// Validation du mot de passe
	if (!passwordRegex.test(password)) {
		return {
			error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
		};
	}

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return { error: error.message }; // Retourne l'erreur sans redirection
	}

	// Si tout est OK, on continue la redirection
	revalidatePath("/");
	redirect(`/success?message=${encodeURIComponent("Connexion réussie !")}`);
}
