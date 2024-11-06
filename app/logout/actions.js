"use server";

import { createSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers"; // Assurez-vous d'importer la méthode cookies

export async function signOut() {
	// Utilisez createSupabaseClient pour obtenir le client Supabase
	const supabase = await createSupabaseClient();

	const cookieStore = cookies(); // Cookies côté serveur

	try {
		// Tentative de déconnexion de l'utilisateur
		const { error } = await supabase.auth.signOut();

		if (error) {
			// Si une erreur survient lors de la déconnexion
			return { success: false, error: "Erreur lors de la déconnexion" };
		}

		// Effacer les cookies d'authentification
		const cookiesToClear = ["sb-access-token", "sb-refresh-token"];
		cookiesToClear.forEach((cookieName) => {
			cookieStore.delete(cookieName); // Effacement du cookie
		});

		// Retourner un statut de succès
		return { success: true };
	} catch (error) {
		console.error("Erreur de déconnexion", error);
		return {
			success: false,
			error: "Une erreur est survenue lors de la déconnexion",
		};
	}
}
