"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Fix hydration issue
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<label className="flex cursor-pointer gap-2">
			{/* Sun Icon */}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="12" cy="12" r="5" />
				<path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
			</svg>

			{/* Toggle Switch */}
			<input
				type="checkbox"
				value="synthwave"
				checked={theme === "dark"}
				onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
				className="toggle theme-controller"
			/>

			{/* Moon Icon */}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
			</svg>
		</label>
	);
}
