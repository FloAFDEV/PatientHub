// lib/session.ts
import { supabase } from "./supabase";

export interface SessionUser {
	id: string;
	email: string;
	osteopathId?: number;
	role: "ADMIN" | "OSTEOPATH";
}

export interface Session {
	user: SessionUser | null;
}

export async function getSession(): Promise<Session | null> {
	try {
		// Utiliser l'instance partagée de Supabase
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();

		if (sessionError) {
			console.error(
				"Erreur lors de la récupération de la session Supabase:",
				sessionError
			);
			return null;
		}

		if (!session) {
			return null;
		}

		// Récupérer les informations utilisateur supplémentaires
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("*, osteopath:osteopaths(*)")
			.eq("id", session.user.id)
			.single();

		if (userError) {
			console.error(
				"Erreur lors de la récupération des données utilisateur:",
				userError
			);
			return null;
		}

		if (!userData) {
			console.warn(
				"Aucune donnée utilisateur trouvée pour l'ID:",
				session.user.id
			);
			return null;
		}

		return {
			user: {
				id: session.user.id,
				email: session.user.email!,
				osteopathId: userData.osteopath?.id,
				role: userData.role,
			},
		};
	} catch (error) {
		console.error(
			"Erreur inattendue lors de la récupération de la session:",
			error
		);
		return null;
	}
}
