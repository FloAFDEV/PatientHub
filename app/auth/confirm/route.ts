import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createSupabaseClient } from "../../../utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;

	// Initialisation du client Supabase
	const supabase = await createSupabaseClient();

	// Vérifie le token OTP et récupérer l'utilisateur connecté
	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		});
		if (!error) {
			// Vérifie si l'utilisateur est authentifié
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			if (userError || !user) {
				console.error("User not authenticated:", userError);
				redirect("/error");
			}
			const userId = user.id;
			// Envoi de la réponse avec l'ID récupéré vers le client
			return new Response(JSON.stringify({ userId }), { status: 200 });
		}
	}

	// Si OTP invalide ou erreur d'authentification
	redirect("/error");
}
