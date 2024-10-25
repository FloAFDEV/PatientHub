"use client"; // Assurez-vous que ce composant est un composant client

import { useEffect } from "react";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import pour la redirection

interface SuccessPageProps {
	searchParams: {
		message?: string;
	};
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
	const message = searchParams.message || "Opération réussie !";
	const router = useRouter();

	useEffect(() => {
		// Rediriger vers /dashboard après 3 secondes (3000 ms)
		const timer = setTimeout(() => {
			router.push("/dashboard");
		}, 3000); // Vous pouvez ajuster le délai à votre convenance

		// Nettoyer le timer au démontage du composant
		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="flex h-screen max-h-screen px-4 sm:px-6 md:px-[5%] bg-gray-100 dark:bg-neutral-800 w-full border border-green-500 dark:border-green-500 flex-col items-center justify-center">
			<Link href="/">
				<Image
					src="/assets/icons/logo-full.svg"
					height={200}
					width={200}
					alt="logo"
					className="mb-8 mt-12 sm:mt-20 rounded-full shadow-gray-600 shadow-2xl"
				/>
			</Link>
			<div>
				<h1 className="text-2xl sm:text-3xl font-semibold text-teal-400 mt-4 sm:mt-6">
					Bienvenue !
				</h1>
			</div>
			<section className="flex flex-col items-center text-center mt-8 sm:mt-12">
				<Image
					src="/assets/gifs/success.gif"
					height={300}
					width={300}
					alt="success"
					sizes="(max-width: 768px) 80vw, (max-width: 600px) 60vw, 33vw"
					className="max-w-full h-auto"
				/>
				<h1
					className="text-2xl sm:text-3xl font-semibold text-teal-400 mt-4 sm:mt-6"
					style={{ whiteSpace: "pre-line" }}
				>
					{message}
				</h1>
			</section>

			{/* Message optionnel pour informer l'utilisateur de la redirection */}
			<p className="mt-4 text-center text-gray-600">
				Vous serez redirigé vers votre espace administrateur dans 3
				secondes...
			</p>

			<Footer />
		</div>
	);
}
