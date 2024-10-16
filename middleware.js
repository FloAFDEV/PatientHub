import { updateSession } from "@/utils/middleware";
import { NextResponse } from "next/server";

export async function middleware(request) {
	// Vérifier l'expiration de la session
	const sessionExpiration = request.cookies.get("sessionExpiration");

	if (sessionExpiration) {
		const expirationTime = parseInt(sessionExpiration.value);
		if (Date.now() > expirationTime) {
			// Session expirée, rediriger vers la page de connexion
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// Continuer avec la mise à jour de la session Supabase
	return await updateSession(request);
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
