import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "PatientHub",
	description:
		"Application de suivi et de gestion de patients en ostéopathie",
	keywords: "ostéopathie, gestion, patients, santé",
	authors: [
		{
			name: "AfdevFlo",
			url: "https://patient-hub-kappa.vercel.app/login",
		},
	],
	viewport: "width=device-width, initial-scale=1",
	robots: "noindex, nofollow",
	openGraph: {
		title: "PatientHub",
		description:
			"Application de suivi et de gestion de patients en ostéopathie",
		url: "https://patient-hub-kappa.vercel.app/login",
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
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
			/>
			<link rel="icon" href="/favicon.ico" />
			{/* Ajoute ici d'autres balises si nécessaire */}
		</>
	);
}
