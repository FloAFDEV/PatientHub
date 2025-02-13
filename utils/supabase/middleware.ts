import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SESSION_EXPIRATION_TIME = 60 * 60 * 1000; // 1 heure (en millisecondes)

export async function updateSession(
	request: NextRequest
): Promise<NextResponse | undefined> {
	// Initialisation de la réponse
	let response = NextResponse.next();

	try {
		// Création du client Supabase
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					get: (name: string) => {
						return request.cookies.get(name)?.value;
					},
					set: (name: string, value: string, options: any) => {
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
					remove: (name: string, options: any) => {
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

		// Vérification utilisateur via Supabase
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) {
			console.error(
				"Erreur lors de la récupération de l'utilisateur :",
				error
			);
			// Rediriger vers / seulement si l'erreur est liée à l'authentification
			if (error.status === 401) {
				console.warn(
					"Aucune session active trouvée ou erreur d'authentification."
				);
				return NextResponse.redirect(new URL("/", request.url));
			} else {
				// Gérer les autres types d'erreurs (par exemple, erreur réseau)
				console.error("Erreur non liée à l'authentification :", error);
				// Peut-être rediriger vers une page d'erreur générique ou simplement ne rien faire
				return; // Ne pas rediriger pour éviter une boucle
			}
		}

		if (!user) {
			console.warn("Aucun utilisateur trouvé dans la session.");
			return NextResponse.redirect(new URL("/", request.url));
		}

		console.log("Utilisateur connecté :", user.email);

		// Session valide, on calcule la nouvelle date d'expiration
		const newExpirationTime = Date.now() + SESSION_EXPIRATION_TIME;

		// Mise à jour du cookie d'expiration
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

		console.log("Cookie sessionExpiration mis à jour.");

		// Retourne une réponse normale si l'utilisateur est connecté et que le cookie est mis à jour
		return response;
	} catch (error) {
		console.error(
			"Erreur inattendue lors de la mise à jour de la session :",
			error
		);
		// Redirection en cas d'erreur générale
		return NextResponse.redirect(new URL("/", request.url));
	}
}
