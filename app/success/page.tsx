// app/success/page.tsx

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
		<div className="flex h-screen max-h-screen px-[5%] bg-gradient-to-r from-sky-800 to-gray-300 flex-col items-center justify-center">
			<Link href="/">
				<Image
					src="/assets/icons/logo-full.svg"
					height={100}
					width={200}
					alt="logo"
					className="mb-8 mt-48 rounded-full shadow-gray-600 shadow-2xl"
				/>
			</Link>

			<section className="flex flex-col items-center text-center mt-20">
				<Image
					src="/assets/gifs/success.gif"
					height={300}
					width={280}
					alt="success"
				/>
				<h1 className="text-3xl font-semibold text-teal-300 mt-6">
					{message}
				</h1>
				<p className="mt-4 text-slate-800 font-medium text-xl">
					Vous pouvez maintenant accéder à votre PatientHub
				</p>
			</section>

			{/* Utilisation d'un bouton simple */}
			<Link href="/" className="mt-8">
				<button className="px-6 py-2 bg-sky-600 text-white drop-shadow-2xl shadow-teal-500 rounded-md hover:bg-indigo-700">
					Retour à la page d'accueil
				</button>
			</Link>

			<footer className="mt-auto mb-4">
				<p className="text-sm text-slate-900">
					© 2024 Franck BLANCHET Ostéopathie
				</p>
			</footer>
		</div>
	);
}
