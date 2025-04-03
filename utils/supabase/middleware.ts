import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";

const SESSION_EXPIRATION_TIME = 60 * 60 * 1000; // 1 heure

export async function updateSession(
	request: NextRequest
): Promise<NextResponse | null> {
	let response = NextResponse.next();

	try {
		const cookies = request.cookies.getAll();

		// Vérifie la durée d'inactivité
		const sessionExpirationCookie = cookies.find(
			(c) => c.name === "sessionExpiration"
		);

		if (!sessionExpirationCookie) {
			console.warn("Pas de cookie de session trouvé. Redirection.");
			return NextResponse.redirect(new URL("/?expired=1", request.url));
		}

		const sessionExpiration = parseInt(sessionExpirationCookie.value, 10);
		if (isNaN(sessionExpiration) || Date.now() > sessionExpiration) {
			console.warn("Session expirée. Redirection.");

			const redirect = NextResponse.redirect(
				new URL("/?expired=1", request.url)
			);
			redirect.cookies.set("sessionExpiration", "", { maxAge: 0 });

			const tokenCookieName = cookies.find((c) =>
				c.name.includes("-auth-token")
			)?.name;
			if (tokenCookieName) {
				redirect.cookies.set(tokenCookieName, "", { maxAge: 0 });
			}

			return redirect;
		}

		// Crée le client Supabase
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					getAll: () => cookies,
					setAll: (newCookies) => {
						newCookies.forEach((cookie) => {
							response.cookies.set(cookie);
						});
					},
				},
			}
		);

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) {
			console.warn("Utilisateur invalide ou erreur d'auth.");
			return NextResponse.redirect(new URL("/?expired=1", request.url));
		}

		// Prolonge la session
		const newExpirationTime = Date.now() + SESSION_EXPIRATION_TIME;
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

		return response;
	} catch (error) {
		console.error("Erreur dans updateSession :", error);
		return NextResponse.redirect(new URL("/?expired=1", request.url));
	}
}
