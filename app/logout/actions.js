"use server";

import { createSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function signOut() {
	// Créer une instance du client Supabase
	const supabase = await createSupabaseClient();

	// Accéder aux cookies côté serveur
	const cookieStore = cookies();

	try {
		// Tentative de déconnexion via Supabase
		const { error } = await supabase.auth.signOut();

		if (error) {
			// Gérer une éventuelle erreur de déconnexion
			console.error("Erreur lors de la déconnexion :", error);
			return { success: false, error: "Erreur lors de la déconnexion" };
		}

		// Effacer les cookies d'authentification en les réglant pour expiration immédiate
		const cookiesToClear = [
			"sb-access-token",
			"sb-refresh-token",
			"sb-auth-token",
			"supabase-auth-token", // + les cookies supplémentaires que Supabase pourrait utiliser
		];

		cookiesToClear.forEach((cookieName) => {
			cookieStore.set(cookieName, "", {
				maxAge: 0, // Expiration immédiate pour supprimer le cookie
				path: "/", // cookie est supprimé pour tout le domaine
				secure: true, // cookie est supprimé en mode sécurisé (HTTPS)
				sameSite: "Strict", //  cookie est supprimé en mode strict
			});
		});

		// Retourner un statut de succès
		return { success: true };
	} catch (error) {
		// Gestion des erreurs générales
		console.error("Erreur inattendue lors de la déconnexion :", error);
		return {
			success: false,
			error: "Une erreur est survenue lors de la déconnexion",
		};
	}
}
