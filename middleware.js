import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";
import { decryptKey } from "@/components/PassKeyModal";

function isSessionExpired(sessionExpiration) {
	const expirationTime = parseInt(sessionExpiration, 10);
	return Date.now() > expirationTime;
}

function isPasskeyValid(passkey) {
	const decryptedPasskey = decryptKey(passkey);
	return decryptedPasskey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY;
}

export async function middleware(request) {
	try {
		// Vérification de l'expiration de la session
		const sessionExpiration = request.cookies.get("sessionExpiration");
		if (sessionExpiration && isSessionExpired(sessionExpiration.value)) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// Vérification des routes protégées
		const protectedRoutes = ["/admin", "/"];
		const pathname = new URL(request.url).pathname;

		if (protectedRoutes.includes(pathname)) {
			const passkey = request.cookies.get("accessKey");

			if (!passkey || !isPasskeyValid(passkey.value)) {
				return NextResponse.redirect(new URL("/passkey", request.url));
			}
		}
	} catch (error) {
		console.error(
			"Erreur lors de la vérification de la session ou de la passkey :",
			error
		);
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Continuer avec la mise à jour de la session
	return await updateSession(request);
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
