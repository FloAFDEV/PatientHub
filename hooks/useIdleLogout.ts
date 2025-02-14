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
		// Nettoyer localStorage
		localStorage.clear();
		// Nettoyer sessionStorage
		sessionStorage.clear();
		// Nettoyer tous les cookies
		document.cookie.split(";").forEach((cookie) => {
			const name = cookie.split("=")[0].trim();
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
		});
		console.log("🧹 Nettoyage du stockage effectué");
	}, []);
	const handleAuthChange = useCallback(
		async (event: AuthChangeEvent, session: Session | null) => {
			console.log(`🔥 Événement Auth : ${event}`);
			console.log("🛠 Session : ", session);
			if (onAuthChange) {
				onAuthChange(event, session);
			}
			if (event === "SIGNED_OUT" || !session) {
				console.log("🔄 Déconnexion détectée");
				cleanupStorage();
				setTimeout(() => {
					console.log("➡️ Redirection vers /");
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
				console.log("⏰ Déconnexion pour inactivité");
				await supabase.auth.signOut();
				cleanupStorage();
				router.push("/");
			}, IDLE_TIMEOUT);
		};
		const handleActivity = () => {
			clearTimeout(activityTimeout);
			activityTimeout = setTimeout(resetTimeout, 1000);
		};
		// Événements à surveiller pour l'activité
		const events = [
			"mousedown",
			"mousemove",
			"keypress",
			"scroll",
			"touchstart",
		];
		events.forEach((event) => {
			window.addEventListener(event, handleActivity);
		});
		resetTimeout(); // Initialiser le timeout
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(handleAuthChange);
		return () => {
			events.forEach((event) => {
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
			console.log("✨ Session rafraîchie avec succès");
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
