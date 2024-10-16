import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabases/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;
	const next = searchParams.get("next") ?? "/";

	if (token_hash && type) {
		const supabase = createClient();

		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		});
		if (!error) {
			// Rediriger l'utilisateur vers l'URL spécifiée ou la racine de l'application
			return redirect(next);
		} else {
			// Message d'erreur lors de la vérification de l'OTP
			console.error(
				"Erreur lors de la vérification du code OTP :",
				error.message
			);
			return redirect(
				`/error?page?message=${encodeURIComponent(error.message)}`
			);
		}
	} else {
		// Gestion des cas où le token_hash ou le type est manquant
		if (!token_hash) {
			console.error("Le token de vérification est manquant.");
		}
		if (!type) {
			console.error(
				"Le type de vérification n'est pas valide ou manquant."
			);
		}
		return redirect("/error?message=Paramètres manquants");
	}
}
