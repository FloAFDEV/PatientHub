// middleware.ts (à la racine)
import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

// Routes qu'on autorise si l'utilisateur N'EST PAS connecté
// (ex: page d'accueil, login, inscription, etc.)
const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

export async function middleware(request: NextRequest) {
	/**
	 * 1. On appelle updateSession, qui peut :
	 *    - renvoyer un NextResponse.redirect() si pas de session
	 *    - ou renvoyer un NextResponse.next() si tout est OK
	 *    - ou null en cas d'erreur non critique
	 */
	const sessionResponse = await updateSession(request);

	// Si updateSession a déjà renvoyé une réponse (redirect ou next),
	// on la retourne pour ne pas surcharger
	if (sessionResponse) {
		// On vérifie si c'est une redirection, etc.
		if (sessionResponse.headers.get("location")) {
			return sessionResponse; // ex: redirection vers "/"
		}
		// Sinon, c'est un NextResponse.next() tout simple. On continue...
	}

	// 2. On crée un client Supabase pour vérifier la session après updateSession
	let response = NextResponse.next();
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					// On récupère tous les cookies de la requête
					return request.cookies.getAll();
				},
				setAll(cookies) {
					// On applique sur la réponse
					cookies.forEach(({ name, value, ...options }) => {
						response.cookies.set({ name, value, ...options });
					});
				},
			},
		}
	);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// 3. Logique de redirection
	// (a) Pas de session => si la route n'est pas publique, on redirige vers "/"
	if (!session && !publicRoutes.includes(request.nextUrl.pathname)) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/";
		return NextResponse.redirect(redirectUrl);
	}

	// (b) Si l'utilisateur est connecté et qu'il essaye d'aller sur "/" => on le redirige
	//     vers "/success" (ou "/dashboard", à adapter)
	if (session && request.nextUrl.pathname === "/") {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/success";
		return NextResponse.redirect(redirectUrl);
	}

	// Sinon, on laisse passer la requête
	return response;
}

// Le matcher exclut toutes les routes "spéciales"
// comme `/api`, `_next/static`, `_next/image`, `favicon.ico`...
// et n'applique le middleware qu'aux autres routes (pages).
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
