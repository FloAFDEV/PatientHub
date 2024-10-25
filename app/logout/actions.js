"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function signOut() {
	const supabase = createClient();
	const cookieStore = cookies();

	try {
		const { error } = await supabase.auth.signOut();
		if (error) {
			return { success: false, error: "Erreur lors de la déconnexion" };
		}

		// Effacement des cookies d'authentification
		const cookiesToClear = ["sb-access-token", "sb-refresh-token"];
		cookiesToClear.forEach((cookieName) => {
			cookieStore.delete(cookieName);
		});

		// Retour du statut de succès, la redirection se fera côté client
		return { success: true };
	} catch (error) {
		console.error("Erreur de déconnexion", error);
		return {
			success: false,
			error: "Une erreur est survenue lors de la déconnexion",
		};
	}
}
