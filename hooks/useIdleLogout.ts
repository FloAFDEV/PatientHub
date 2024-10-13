// hooks/useIdleLogout.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

export const useIdleLogout = () => {
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const checkSessionExpiration = async () => {
			const expirationTime = document.cookie
				.split("; ")
				.find((row) => row.startsWith("sessionExpiration="))
				?.split("=")[1];

			if (expirationTime && Date.now() > parseInt(expirationTime)) {
				await supabase.auth.signOut();
				router.push("/login?error=Session expirée");
			}
		};

		const handleActivity = () => {
			clearTimeout(timeoutId);
			checkSessionExpiration();
			timeoutId = setTimeout(checkSessionExpiration, EXPIRATION_TIME);
		};

		window.addEventListener("mousemove", handleActivity);
		window.addEventListener("keypress", handleActivity);
		window.addEventListener("click", handleActivity);
		window.addEventListener("scroll", handleActivity);

		handleActivity();

		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener("mousemove", handleActivity);
			window.removeEventListener("keypress", handleActivity);
			window.removeEventListener("click", handleActivity);
			window.removeEventListener("scroll", handleActivity);
		};
	}, [router]);
};
