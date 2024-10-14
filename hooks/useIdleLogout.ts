"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

export const useIdleLogout = () => {
	const router = useRouter();

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const checkSessionExpiration = async () => {
			const expirationTime = document.cookie
				.split("; ")
				.find((row) => row.startsWith("sessionExpiration="))
				?.split("=")[1];

			if (expirationTime && Date.now() > parseInt(expirationTime, 10)) {
				// Appel à NextAuth pour se déconnecter
				await signOut({ callbackUrl: "/login?error=Session expirée" });
			}
		};

		const handleActivity = () => {
			clearTimeout(timeoutId);
			checkSessionExpiration(); // Vérifiez immédiatement lors d'une activité
			timeoutId = setTimeout(checkSessionExpiration, EXPIRATION_TIME);
		};

		// Ajoutez des écouteurs d'événements pour détecter l'activité de l'utilisateur
		window.addEventListener("mousemove", handleActivity);
		window.addEventListener("keypress", handleActivity);
		window.addEventListener("click", handleActivity);
		window.addEventListener("scroll", handleActivity);

		// Appel initial pour définir le timeout
		handleActivity();

		// Nettoyage lors du démontage du composant
		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener("mousemove", handleActivity);
			window.removeEventListener("keypress", handleActivity);
			window.removeEventListener("click", handleActivity);
			window.removeEventListener("scroll", handleActivity);
		};
	}, [router]);
};
