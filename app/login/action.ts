"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
	const supabase = createClient();
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password) {
		redirect(
			`/error?page?message=${encodeURIComponent(
				"Email ou mot de passe manquant."
			)}`
		);
		return; // Sortir de la fonction après redirection
	}

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		redirect(`/error?page?message=${encodeURIComponent(error.message)}`);
		return;
	}

	revalidatePath("/");
	redirect(`/success?message=${encodeURIComponent("Connexion réussie !")}`);
}
