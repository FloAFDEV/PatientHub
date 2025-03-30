// utils/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";

// Durée de la session : 1 heure (en millisecondes)
const SESSION_EXPIRATION_TIME = 60 * 60 * 1000;

export async function updateSession(
	request: NextRequest
): Promise<NextResponse | null> {
	/**
	 * On part d'une réponse "next" par défaut,
	 * qu'on modifiera si besoin.
	 */
	let response = NextResponse.next();

	try {
		// Création du client Supabase
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					// Lecture des cookies depuis la requête
					get: (name: string) => {
						return request.cookies.get(name)?.value;
					},
					// Écriture: on mettra à jour la "response" pour y ajouter des cookies
					set: (name: string, value: string, options: any) => {
						// On recrée une NextResponse pour coller nos nouveaux cookies
						response = NextResponse.next({
							request: {
								headers: request.headers,
							},
						});
						response.cookies.set({
							name,
							value,
							...options,
						});
					},
					remove: (name: string) => {
						response = NextResponse.next({
							request: {
								headers: request.headers,
							},
						});
						response.cookies.delete(name);
					},
				},
			}
		);

		// Récupération de l'utilisateur
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) {
			console.error(
				"Erreur lors de la récupération de l'utilisateur :",
				error
			);

			// Si c'est une erreur d'auth (401), on redirige vers la page d'accueil
			if (error.status === 401) {
				console.warn("Pas de session active ou erreur d'auth.");
				return NextResponse.redirect(new URL("/", request.url));
			} else {
				// Autres erreurs (réseau, serveur, etc.) => on ne redirige pas forcément
				// vous pouvez renvoyer null pour continuer, ou rediriger vers une page d'erreur
				console.error("Erreur non liée à l'authentification :", error);
				return null;
			}
		}

		if (!user) {
			console.warn("Aucun utilisateur trouvé dans la session.");
			return NextResponse.redirect(new URL("/", request.url));
		}

		console.log("Utilisateur connecté :", user.email);

		// Session valide, on recalcule la nouvelle date d'expiration
		const newExpirationTime = Date.now() + SESSION_EXPIRATION_TIME;

		// Mise à jour du cookie 'sessionExpiration'
		response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
		response.cookies.set(
			"sessionExpiration",
			newExpirationTime.toString(),
			{
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
			}
		);

		console.log("Cookie 'sessionExpiration' prolongé.");

		// On retourne la réponse (avec le nouveau cookie).
		return response;
	} catch (error) {
		console.error("Erreur inattendue dans updateSession :", error);
		// En cas d'erreur générale, on redirige vers l'accueil
		return NextResponse.redirect(new URL("/", request.url));
	}
}
