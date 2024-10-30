"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

interface SuccessPageProps {
	searchParams: {
		message?: string;
	};
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
	const message = searchParams.message || "Opération réussie !";
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/dashboard");
		}, 3000); // Redirection après 3 secondes

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
					width={250}
					height={250}
					alt="success"
					sizes="(max-width: 768px) 80vw, (max-width: 500px) 50vw, 33vw"
					className="max-w-full h-auto"
					unoptimized
				/>
				<h1
					className="text-2xl sm:text-3xl font-semibold text-teal-400 mt-4 sm:mt-6"
					style={{ whiteSpace: "pre-line" }}
				>
					{message}
				</h1>
			</section>

			<p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
				Redirection automatique vers le tableau de bord dans 3
				secondes...
			</p>

			<Link href="/dashboard" className="mt-6 sm:mt-8">
				<button className="px-4 py-2 sm:px-6 sm:py-3 text-lg sm:text-xl bg-sky-600 text-white drop-shadow-2xl shadow-teal-500 rounded-md hover:bg-sky-800 transition duration-300">
					Accéder immédiatement au tableau de bord
				</button>
			</Link>

			<Footer />
		</div>
	);
}
