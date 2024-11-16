import { cookies } from "next/headers";
import { createClient } from "../../utils/supabase/client";

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
		const supabase = createClient();

		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();

		if (error || !session) {
			return null;
		}

		// Récupérer les informations supplémentaires de l'utilisateur depuis la base de données
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("*, osteopath:osteopaths(*)")
			.eq("id", session.user.id)
			.single();

		if (userError || !userData) {
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
		console.error("Erreur lors de la récupération de la session:", error);
		return null;
	}
}
