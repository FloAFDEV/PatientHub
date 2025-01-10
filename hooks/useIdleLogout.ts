"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useIdleLogout = () => {
	const router = useRouter();

	useEffect(() => {
		// Surveiller les changements d'état d'authentification
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				if (event === "SIGNED_OUT" || !session) {
					console.log("Session expirée ou utilisateur déconnecté.");
					router.push("/login");
				}
			}
		);

		// Nettoyage à la désinstallation du composant
		return () => {
			authListener.subscription.unsubscribe();
		};
	}, [router]);

	// Méthode pour rafraîchir manuellement la session (facultatif)
	const refreshSession = async () => {
		const { error } = await supabase.auth.refreshSession();
		if (error) {
			console.error("Erreur lors du rafraîchissement :", error.message);
		} else {
			console.log("Session rafraîchie avec succès.");
		}
	};

	return { refreshSession };
};
