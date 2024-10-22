// app/success/page.tsx

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
				<h1 className="text-2xl sm:text-3xl font-semibold text-teal-300 mt-4 sm:mt-6">
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
				<h1 className="text-2xl sm:text-3xl font-semibold text-teal-300 mt-4 sm:mt-6">
					{message}
				</h1>
				<p className="mt-2 sm:mt-4 font-medium text-lg sm:text-xl">
					Vous pouvez maintenant accéder à votre PatientHub
				</p>
			</section>

			{/* Utilisation d'un bouton simple */}
			<Link href="/dashboard" className="mt-6 sm:mt-8">
				<button className="px-4 py-2 sm:px-6 sm:py-3 text-lg sm:text-xl bg-sky-600 text-white drop-shadow-2xl shadow-teal-500 rounded-md hover:bg-sky-800 transition duration-300">
					Vers accès administrateur
				</button>
			</Link>

			<Footer />
		</div>
	);
}
