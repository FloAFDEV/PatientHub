"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function signOut() {
	const supabase = createClient();
	const cookieStore = cookies();

	try {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("Erreur lors de la déconnexion:", error);
			throw error;
		}

		// Nettoyer les cookies de session
		const cookiesToClear = [
			"sb-access-token",
			"sb-refresh-token",
			// Ajoute d'autres cookies si nécessaire
		];

		cookiesToClear.forEach((cookieName) => {
			cookieStore.delete(cookieName);
		});

		console.log("Déconnexion réussie et cookies nettoyés");
		return { success: true };
	} catch (error) {
		console.error("Erreur inattendue lors de la déconnexion:", error);
		return {
			success: false,
			error: "Une erreur est survenue lors de la déconnexion",
		};
	}
}
