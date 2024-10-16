import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "PatientHub",
	description:
		"Application de suivi et de gestion de patients en ostéopathie",
	keywords: "ostéopathie, gestion, patients, santé",
	authors: [{ name: "Florent Perez", url: "https://example.com" }], // Remplace par ton URL
	viewport: "width=device-width, initial-scale=1",
	robots: "noindex, nofollow", //  ne pas indexer
	openGraph: {
		title: "PatientHub",
		description:
			"Application de suivi et de gestion de patients en ostéopathie",
		url: "https://example.com", // Remplace par l'URL de ton application
		siteName: "PatientHub",
		images: [
			{
				url: "https://example.com/path/to/image.jpg",
				width: 1200,
				height: 630,
			},
		],
		locale: "fr_FR",
		type: "website",
	},
};

export default function Head() {
	return (
		<>
			<meta name="theme-color" content="#000000" />
			<link rel="icon" href="/favicon.ico" />
			{/* Ajoute ici d'autres balises si nécessaire */}
		</>
	);
}
