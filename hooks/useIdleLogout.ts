"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

interface IdleLogoutOptions {
	redirectDelay?: number;
	onAuthChange?: (event: AuthChangeEvent, session: Session | null) => void;
}

export const useIdleLogout = (options: IdleLogoutOptions = {}) => {
	const router = useRouter();
	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const { redirectDelay = 1000, onAuthChange } = options;

	const cleanupStorage = useCallback(() => {
		localStorage.clear();
		sessionStorage.clear();
		document.cookie.split(";").forEach((cookie) => {
			const name = cookie.split("=")[0].trim();
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
		});
		if (process.env.NODE_ENV === "development") {
			console.log("🧹 Nettoyage du stockage effectué");
		}
	}, []);

	const handleAuthChange = useCallback(
		async (event: AuthChangeEvent, session: Session | null) => {
			if (process.env.NODE_ENV === "development") {
				console.log(`🔥 Événement Auth : ${event}`);
				if (session?.user) {
					console.log("👤 Utilisateur connecté :", {
						id: session.user.id,
						email: session.user.email,
					});
				} else {
					console.log("⚠️ Aucune session active");
				}
			}
			if (onAuthChange) {
				onAuthChange(event, session);
			}
			if (event === "SIGNED_OUT" || !session) {
				if (process.env.NODE_ENV === "development") {
					console.log("🔄 Déconnexion détectée");
					console.log("➡️ Redirection vers /");
				}
				cleanupStorage();
				setTimeout(() => {
					router.push("/");
				}, redirectDelay);
			}
		},
		[router, redirectDelay, onAuthChange, cleanupStorage]
	);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		let activityTimeout: NodeJS.Timeout;
		const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

		const resetTimeout = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(async () => {
				if (process.env.NODE_ENV === "development") {
					console.log("⏰ Déconnexion pour inactivité");
				}
				await supabase.auth.signOut();
				cleanupStorage();
				router.push("/");
			}, IDLE_TIMEOUT);
		};

		const handleActivity = () => {
			clearTimeout(activityTimeout);
			activityTimeout = setTimeout(resetTimeout, 1000);
		};

		const activityEvents = [
			"mousedown",
			"mousemove",
			"keypress",
			"scroll",
			"touchstart",
		];

		activityEvents.forEach((event) => {
			window.addEventListener(event, handleActivity);
		});

		resetTimeout();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(handleAuthChange);

		return () => {
			activityEvents.forEach((event) => {
				window.removeEventListener(event, handleActivity);
			});
			clearTimeout(timeoutId);
			clearTimeout(activityTimeout);
			subscription.unsubscribe();
		};
	}, [supabase, handleAuthChange, router, cleanupStorage]);

	const refreshSession = useCallback(async () => {
		try {
			const { error } = await supabase.auth.refreshSession();
			if (error) throw error;
			if (process.env.NODE_ENV === "development") {
				console.log("✨ Session rafraîchie avec succès");
			}
		} catch (error) {
			console.error(
				"❌ Erreur lors du rafraîchissement de la session :",
				error
			);
			router.push("/");
		}
	}, [supabase, router]);

	return {
		refreshSession,
		logout: async () => {
			await supabase.auth.signOut();
			cleanupStorage();
			router.push("/");
		},
	};
};
