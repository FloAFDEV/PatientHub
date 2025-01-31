"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export const useIdleLogout = () => {
	const router = useRouter();
	const supabase = createClient();

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
	}, [router, supabase]);

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
