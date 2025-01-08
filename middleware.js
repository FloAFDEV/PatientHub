import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";
import { decryptKey } from "@/components/PassKeyModal";

export async function middleware(request) {
	try {
		const url = new URL(request.url);
		const pathname = url.pathname;

		console.log("Middleware activé pour :", pathname);

		// Cookies
		const sessionExpiration = request.cookies.get("sessionExpiration");
		const passkey = request.cookies.get("accessKey");

		console.log("Cookies reçus :", {
			sessionExpiration: sessionExpiration?.value,
			passkey: passkey?.value,
		});

		// Routes publiques (pas besoin de vérifications)
		const publicRoutes = ["/login", "/passkey"];
		if (publicRoutes.includes(pathname)) {
			console.log("Route publique, pas de vérification.");
			return NextResponse.next();
		}

		// Vérification de l'expiration de la session
		if (sessionExpiration) {
			const expirationTime = parseInt(sessionExpiration.value, 10);
			if (Date.now() > expirationTime) {
				console.log("Session expirée, redirection vers /login");
				return NextResponse.redirect(new URL("/login", request.url));
			}
		} else {
			console.log("Pas de sessionExpiration, redirection vers /login");
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// Routes protégées
		const protectedRoutes = ["/admin", "/"];
		if (protectedRoutes.includes(pathname)) {
			console.log("Route protégée détectée :", pathname);

			// Vérifier la passkey
			if (!passkey) {
				console.log(
					"Aucune passkey trouvée, redirection vers /passkey"
				);
				return NextResponse.redirect(new URL("/passkey", request.url));
			}

			const decryptedPasskey = decryptKey(passkey.value);
			if (decryptedPasskey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
				console.log("Passkey invalide, redirection vers /passkey");
				return NextResponse.redirect(new URL("/passkey", request.url));
			}
		}

		// Continuer avec la mise à jour de la session Supabase
		console.log("Session valide, mise à jour en cours...");
		return await updateSession(request);
	} catch (error) {
		console.error(
			"Erreur lors de la vérification de la session ou de la passkey:",
			error
		);
		return NextResponse.redirect(new URL("/login", request.url));
	}
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
