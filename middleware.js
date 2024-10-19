import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";

export async function middleware(request) {
	try {
		// Vérifier l'expiration de la session
		const sessionExpiration = request.cookies.get("sessionExpiration");

		if (sessionExpiration) {
			const expirationTime = parseInt(sessionExpiration.value);
			if (Date.now() > expirationTime) {
				// Session expirée, rediriger vers la page de connexion
				return NextResponse.redirect(new URL("/login", request.url));
			}
		}
	} catch (error) {
		console.error(
			"Erreur lors de la vérification de l'expiration de la session:",
			error
		);
		// En cas d'erreur, rediriger vers la page de connexion
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Continuer avec la mise à jour de la session Supabase
	return await updateSession(request);
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
