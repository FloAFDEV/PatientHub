// app/layout.tsx

import { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "PatientHub",
	description:
		"Application de suivi et de gestion de patients en osthéopathie",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr">
			<body
				className={`${geistSans.variable} antialiased flex flex-col min-h-screen`}
			>
				{children}
				<Footer /> {/* Ajouter le footer ici */}
			</body>
		</html>
	);
}
