import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
	const cookieStore = cookies();

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Your project's URL and Key are required to create a Supabase client!"
		);
	}

	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name) {
				return cookieStore.get(name)?.value;
			},
			set(name, value, options) {
				try {
					cookieStore.set({ name, value, ...options });
				} catch (_) {
					// The `set` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
			remove(name, options) {
				try {
					cookieStore.set({ name, value: "", ...options });
				} catch (_) {
					// The `delete` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
		},
	});
}
