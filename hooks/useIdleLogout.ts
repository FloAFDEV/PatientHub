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

			console.log("Checking session expiration:", expirationTime); // Logging the expiration time

			if (expirationTime && Date.now() > parseInt(expirationTime, 10)) {
				console.log("Session expired, logging out."); // Logging session expiration
				await signOut({ callbackUrl: "/login?error=Session expirée" });
			}
		};

		const handleActivity = () => {
			clearTimeout(timeoutId);
			checkSessionExpiration(); // Check expiration on activity
			timeoutId = setTimeout(checkSessionExpiration, EXPIRATION_TIME);
		};

		// Add event listeners to detect user activity
		window.addEventListener("mousemove", handleActivity);
		window.addEventListener("keypress", handleActivity);
		window.addEventListener("click", handleActivity);
		window.addEventListener("scroll", handleActivity);

		// Initial call to set the timeout
		handleActivity();

		// Cleanup on component unmount
		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener("mousemove", handleActivity);
			window.removeEventListener("keypress", handleActivity);
			window.removeEventListener("click", handleActivity);
			window.removeEventListener("scroll", handleActivity);
		};
	}, [router]);
};
