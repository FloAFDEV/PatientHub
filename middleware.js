import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";
import { decryptKey } from "@/components/PassKeyModal";

export async function middleware(request) {
	try {
		// Vérification de l'expiration de la session
		const sessionExpiration = request.cookies.get("sessionExpiration");
		if (sessionExpiration) {
			const expirationTime = parseInt(sessionExpiration.value);
			if (Date.now() > expirationTime) {
				return NextResponse.redirect(new URL("/", request.url));
			}
		}

		// Vérifier la passkey pour les routes protégées
		const protectedRoutes = ["/admin", "/"]; // Liste des routes protégées
		const passkey = request.cookies.get("accessKey");

		if (protectedRoutes.includes(new URL(request.url).pathname)) {
			// Si la route est protégée mais pas de passkey valide, rediriger vers la page de passkey
			if (!passkey) {
				return NextResponse.redirect(new URL("/error", request.url)); // Redirection vers la page de saisie de passkey
			}

			// Vérification de la passkey
			const decryptedPasskey = decryptKey(passkey.value); // Déchiffrement de la passkey
			if (decryptedPasskey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
				return NextResponse.redirect(new URL("/passkey", request.url)); // Redirection vers la page de passkey si incorrecte
			}
		}
	} catch (error) {
		console.error(
			"Erreur lors de la vérification de la session ou de la passkey:",
			error
		);
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
