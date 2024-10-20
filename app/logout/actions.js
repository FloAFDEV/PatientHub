"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function logout() {
	console.log("Déconnexion en cours...");
	const supabase = createClient();

	// Tentez de se déconnecter
	const { error } = await supabase.auth.signOut();
	console.log("Erreur de déconnexion:", error);

	// Gérer les erreurs
	if (error) {
		redirect("/error");
		return; // Sortir de la fonction après redirection
	}

	// Redirection après déconnexion réussie
	console.log(
		"Déconnexion réussie, redirection vers la page de connexion..."
	);
	redirect("/login");
}
