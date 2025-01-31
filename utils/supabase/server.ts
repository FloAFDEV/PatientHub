import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

if (
	!process.env.NEXT_PUBLIC_SUPABASE_URL ||
	!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
	throw new Error("Supabase environment variables are manquantes.");
}

export async function createSupabaseClient() {
	const cookieStore = await cookies();

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch (error) {
						console.error(
							"Erreur lors de la mise à jour des cookies:",
							error
						);
					}
				},
			},
		}
	);

	return supabase;
}
