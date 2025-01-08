import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";
import { decryptKey } from "@/components/PassKeyModal";

// Fonction pour vérifier si la session a expiré
function isSessionExpired(sessionExpiration) {
	const expirationTime = Number(sessionExpiration); // Convertir le timestamp en nombre
	return Date.now() > expirationTime; // Comparer avec l'heure actuelle
}

// Fonction pour vérifier si la passkey est valide
function isPasskeyValid(passkey) {
	try {
		const decryptedPasskey = decryptKey(passkey); // Déchiffrer la passkey
		return decryptedPasskey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY; // Vérifier si elle est valide
	} catch (error) {
		console.error("Erreur lors du décryptage de la passkey :", error);
		return false;
	}
}

export async function middleware(request) {
	try {
		// Vérification de l'expiration de la session
		const sessionExpiration = request.cookies.get("sessionExpiration");

		// Si la session a expiré, rediriger vers la page de connexion
		if (sessionExpiration && isSessionExpired(sessionExpiration.value)) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// Vérification des routes protégées ("/admin" et "/")
		const protectedRoutes = ["/admin", "/"];
		const pathname = new URL(request.url).pathname;

		// Si l'URL demandée est protégée, vérifier la passkey
		if (protectedRoutes.includes(pathname)) {
			const passkey = request.cookies.get("accessKey");

			// Si la passkey est absente ou invalide, rediriger vers la page de passkey
			if (!passkey || !isPasskeyValid(passkey.value)) {
				return NextResponse.redirect(new URL("/passkey", request.url));
			}
		}

		// Définir un nouveau cookie d'expiration de session si nécessaire
		const expirationTime = Date.now() + 60 * 60 * 1000; // 1 heure
		const response = NextResponse.next(); // Continuer la requête
		response.cookies.set("sessionExpiration", expirationTime.toString(), {
			httpOnly: true,
			secure: true,
		});
		return response;
	} catch (error) {
		// Si une erreur survient, rediriger vers la page de connexion
		console.error(
			"Erreur lors de la vérification de la session ou de la passkey :",
			error
		);
		return NextResponse.redirect(new URL("/login", request.url));
	}
}

// Configuration pour définir les routes à intercepter
export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
