"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
	const supabase = createClient();
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		// Redirection avec un message d'erreur
		redirect(`/error?page?message=${encodeURIComponent(error.message)}`);
		return; // Sortir de la fonction après redirection
	}

	revalidatePath("/", "layout");
	// Redirection vers la page de succès
	redirect(`/success?message=${encodeURIComponent("Connexion réussie !")}`);
}

export async function signup(formData: FormData) {
	const supabase = createClient();
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		// Redirection avec un message d'erreur
		redirect(`/error?page?message=${encodeURIComponent(error.message)}`);
		return; // Sortir de la fonction après redirection
	}

	revalidatePath("/", "layout");
	// Redirection vers la page de succès
	redirect(
		`/success?message=${encodeURIComponent(
			"Inscription réussie ! Vérifiez votre boîte mail pour confirmer votre compte."
		)}`
	);
}
