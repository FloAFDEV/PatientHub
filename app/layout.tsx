import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "@/app/head";
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
	const defaultTheme = "light"; // Définit un thème par défaut

	return (
		<html
			lang="fr"
			className={`${GeistSans.variable}`}
			suppressHydrationWarning
		>
			<body className={`${defaultTheme}`} suppressHydrationWarning>
				{" "}
				{/* Suppression des classes ici */}
				<ThemeProvider
					attribute="class"
					defaultTheme={defaultTheme}
					enableSystem
					disableTransitionOnChange
				>
					{children} {/* Rendu des enfants ici */}
				</ThemeProvider>
			</body>
		</html>
	);
}
