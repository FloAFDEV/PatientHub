import { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "@/components/Footer";
import IdleLogout from "@/components/useIdleLogout";
import "./globals.css";

// Chargement de la police
const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	weight: "100 900",
	display: "swap",
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
			<body className="antialiased flex flex-col min-h-screen">
				{children}
			</body>
		</html>
	);
}
