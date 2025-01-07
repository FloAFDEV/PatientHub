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
	const decryptedPasskey = decryptKey(passkey); // Déchiffrer la passkey
	return decryptedPasskey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY; // Vérifier si elle est valide
}

const expirationTime = Date.now() + 60 * 60 * 1000; // 1 heure
res.cookie("sessionExpiration", expirationTime, {
	httpOnly: true,
	secure: true,
});

export async function middleware(request) {
	try {
		// Vérification de l'expiration de la session
		const sessionExpiration = request.cookies.get("sessionExpiration");
		// console.log("sessionExpiration:", sessionExpiration); // Debugging

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
	} catch (error) {
		// Si une erreur survient, rediriger vers la page de connexion
		console.error(
			"Erreur lors de la vérification de la session ou de la passkey :",
			error
		);
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Continuer avec la mise à jour de la session
	return await updateSession(request);
}

// Configuration pour définir les routes à intercepter
export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
