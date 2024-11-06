import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Durée d'expiration de la session (30 minutes)
const SESSION_EXPIRATION = 30 * 60 * 1000;

export async function updateSession(request: NextRequest) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	// Créer le client Supabase avec la nouvelle approche de gestion des cookies
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				// Utilisation de getAll pour récupérer tous les cookies
				getAll() {
					return request.cookies.getAll(); // On récupère tous les cookies
				},
				// Utilisation de setAll pour définir tous les cookies
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						// Définir les cookies dans la réponse (assurez-vous que la réponse est modifiée)
						response.cookies.set(name, value, options);
					});
				},
			},
		}
	);

	try {
		// Vérifier la session actuelle
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (session) {
			// Si la session est active, on met à jour le cookie d'expiration
			const expirationTime = Date.now() + SESSION_EXPIRATION;
			response.cookies.set({
				name: "sessionExpiration",
				value: expirationTime.toString(),
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: SESSION_EXPIRATION / 1000, // en secondes
			});
		} else {
			// Si la session est expirée, on vérifie la valeur du cookie d'expiration
			const sessionExpiration = request.cookies.get("sessionExpiration");
			if (
				sessionExpiration &&
				Date.now() > parseInt(sessionExpiration.value)
			) {
				// Si la session a expiré, on déconnecte l'utilisateur et redirige vers la page de login
				await supabase.auth.signOut();
				return NextResponse.redirect(new URL("/login", request.url));
			}
		}

		// Si l'utilisateur n'est pas connecté et que l'URL actuelle ne correspond pas aux pages autorisées, on le redirige vers la page de login
		if (
			!session &&
			!request.nextUrl.pathname.startsWith("/login") &&
			!request.nextUrl.pathname.startsWith("/auth")
		) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// Renvoi de la réponse avec les cookies mis à jour
		return response;
	} catch (error) {
		console.error("Erreur lors de la mise à jour de la session:", error);
		return response; // Retourner la réponse sans modification si une erreur se produit
	}
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)", // matcher tous les chemins sauf les fichiers statiques
	],
};
