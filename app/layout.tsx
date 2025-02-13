import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import AppLayout from "@/components/AppLayout";
import ClientLayout from "./ClientLayout";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
	title: "PatientHub",
	description:
		"Application de suivi et de gestion de patients en ostéopathie",
	openGraph: {
		title: "PatientHub",
		description:
			"Application de suivi et de gestion de patients en ostéopathie",
		url: "https://patient-hub-kappa.vercel.app/",
		siteName: "PatientHub",
		images: [
			{
				url: "https://patient-hub-kappa.vercel.app/og-image.png", // URL absolue
				width: 1200,
				height: 630,
			},
		],
		locale: "fr_FR",
		type: "website",
	},
	other: {
		keywords: "ostéopathie, gestion, patients, santé",
		robots: "noindex, nofollow",
		authors: JSON.stringify([
			{ name: "AfdevFlo", url: "https://patient-hub-kappa.vercel.app/" },
		]), // Besoin de stringifier pour éviter les erreurs
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr" className={GeistSans.variable} suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="theme-color" content="#000000" />
			</head>
			<body suppressHydrationWarning>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ClientLayout>
						<AppLayout>{children}</AppLayout>
						<Analytics />
					</ClientLayout>
				</ThemeProvider>
			</body>
		</html>
	);
}
