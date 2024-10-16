// app/layout.tsx

import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "@/app/head"; // Assurez-vous que ce composant ne génère pas de classes dynamiques
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
	title: "PatientHub",
	description:
		"Application de suivi et de gestion de patients en ostéopathie",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const currentTheme =
		typeof window !== "undefined" ? localStorage.getItem("theme") : "light";

	return (
		<html lang="fr" className={`${GeistSans.variable}`}>
			<Head />
			<body
				className={`antialiased flex flex-col min-h-screen ${currentTheme}`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<ClientLayout>{children}</ClientLayout>
				</ThemeProvider>
			</body>
		</html>
	);
}
