import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Durée d'expiration de la session (60 minutes)
const SESSION_EXPIRATION = 60 * 60 * 1000;

export async function updateSession(request: NextRequest) {
	let response = NextResponse.next({
		request,
	});

	// Création du client Supabase avec gestion des cookies
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						response.cookies.set(name, value, options);
					});
				},
			},
		}
	);

	// Vérification de la session actuelle
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		// Mise à jour du cookie d'expiration si la session est active
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
		// Vérification de l'expiration de la session
		const sessionExpiration = request.cookies.get("sessionExpiration");
		if (
			sessionExpiration &&
			Date.now() > parseInt(sessionExpiration.value)
		) {
			// Déconnexion si la session a expiré
			await supabase.auth.signOut();
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// Désactivation de la mise en cache
	response.headers.set("Cache-Control", "no-store");

	// Redirection si l'utilisateur n'est pas authentifié
	if (
		!user &&
		!request.nextUrl.pathname.startsWith("/login") &&
		!request.nextUrl.pathname.startsWith("/auth")
	) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return response;
}
