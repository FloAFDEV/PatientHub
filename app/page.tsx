"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { Clock, Users, FileText, CheckCircle, Activity } from "lucide-react";

// 🔧 Nouveau composant pour gérer searchParams avec Suspense
function SearchParamsHandler() {
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		if (searchParams.get("expired") === "1") {
			toast.warning(
				"Votre session a expiré. Veuillez vous reconnecter.",
				{
					position: "top-center",
					autoClose: 4000,
				}
			);

			setTimeout(() => {
				router.push("/login");
			}, 4500);
		}
	}, [searchParams, router]);

	return null; // rien à afficher
}

function App() {
	return (
		<div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
			<ToastContainer />

			{/* 👉 Ajout de Suspense ici pour éviter l’erreur */}
			<Suspense fallback={null}>
				<SearchParamsHandler />
			</Suspense>

			{/* Hero Section */}
			<header className="relative pt-16 pb-32 px-6 bg-slate-900 text-white">
				<div className="flex items-center space-x-2 mb-12 justify-center md:justify-start">
					<Activity className="w-12 h-12 text-blue-500" />
					<span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
						PatientHub
					</span>
				</div>
				<div className="max-w-6xl mx-auto text-center">
					<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
						<span className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
							PatientHub
						</span>{" "}
						La solution idéale pour les ostéopathes
					</h1>
					<p className="mt-6 text-xl max-w-4xl mx-auto text-gray-400">
						Simplifiez la gestion de votre cabinet et
						concentrez-vous sur vos patients. Découvrez PatientHub
						gratuitement !
					</p>
					<div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
						<button className="px-8 py-4 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-full transform hover:scale-105 transition duration-300">
							Découvrir PatientHub gratuitement
						</button>
						<Link href="/login">
							<button className="px-8 py-4 text-lg font-semibold border border-white hover:bg-white/10 rounded-full transform hover:scale-105 transition duration-300">
								Déjà inscrit ? Se connecter
							</button>
						</Link>
					</div>

					{/* Hero Image */}
					<div className="mt-16 relative h-[400px]">
						<Image
							src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80"
							alt="Medical Professional at Work"
							fill
							className="rounded-xl opacity-80 object-cover"
						/>
					</div>
				</div>
			</header>

			{/* Features Section */}
			<section className="py-24 px-6 container mx-auto">
				<h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
					Les fonctionnalités clés de PatientHub
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition duration-300"
						>
							<div className="w-12 h-12 mb-6 text-blue-500">
								{feature.icon}
							</div>
							<h3 className="text-xl font-semibold mb-4">
								{feature.title}
							</h3>
							<p className="text-gray-600">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-24 bg-gray-50">
				<div className="container mx-auto px-6">
					<h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
						Ce que nos utilisateurs disent
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{testimonials.map((testimonial, index) => (
							<div
								key={index}
								className="bg-white rounded-2xl p-8 shadow-lg flex items-start"
							>
								<Image
									src={testimonial.image}
									alt={testimonial.name}
									width={64}
									height={64}
									style={{ objectFit: "cover" }}
									className="rounded-full mr-6"
								/>
								<div>
									<h4 className="text-lg font-semibold">
										{testimonial.name}
									</h4>
									<p className="text-gray-600 mb-2">
										{testimonial.role}
									</p>
									<p className="text-gray-700 italic">
										&quot;{testimonial.quote}&quot;
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Value Props */}
			<section className="py-24 bg-white">
				<div className="container mx-auto px-6">
					<h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
						Pourquoi PatientHub est indispensable ?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{valueProps.map((prop, index) => (
							<div
								key={index}
								className="p-6 bg-gray-50 rounded-2xl shadow-md"
							>
								<div className="text-blue-500 mb-4">
									{prop.icon}
								</div>
								<h3 className="text-xl font-semibold mb-2">
									{prop.title}
								</h3>
								<p className="text-gray-600">
									{prop.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-blue-100 py-32 text-center">
				<div className="container mx-auto px-6">
					<h2 className="text-3xl font-bold text-gray-900 mb-6">
						Simplifiez votre pratique ostéopathique dès
						aujourd&apos;hui !
					</h2>
					<p className="text-xl max-w-4xl mx-auto text-gray-700 mb-8">
						Rejoignez une communauté d&apos;ostéopathes qui ont
						choisi PatientHub pour simplifier leur quotidien et
						offrir un service exceptionnel à leurs patients.
					</p>
					<button className="px-12 py-4 text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-full transform hover:scale-105 transition duration-300">
						Découvrir PatientHub gratuitement
					</button>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="container mx-auto px-6">
					<div className="flex flex-col items-center md:flex-row justify-between">
						<div className="flex items-center space-x-2 mb-4 md:mb-0">
							<Activity className="w-8 h-8 text-blue-500" />
							<span className="text-2xl font-bold">
								PatientHub
							</span>
						</div>
						<div className="text-gray-400">
							© 2024 PatientHub. Tous droits réservés.
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

const features = [
	{
		title: "Gestion simplifiée des patients",
		description:
			"Accédez rapidement à l'historique de vos patients, leurs informations et rendez-vous.",
		icon: <Users className="w-full h-full" />,
	},
	{
		title: "Planning intuitif",
		description:
			"Organisez votre emploi du temps et envoyez des rappels automatiques à vos patients.",
		icon: <Clock className="w-full h-full" />,
	},
	{
		title: "Facturation automatisée",
		description:
			"Générez des factures professionnelles en quelques clics et suivez vos paiements.",
		icon: <FileText className="w-full h-full" />,
	},
];

const testimonials = [
	{
		name: "Dr. Élise Martin",
		role: "Ostéopathe",
		quote: "PatientHub a transformé ma façon de travailler. Je gagne un temps précieux pour mes patients.",
		image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
	},
	{
		name: "Dr. Pierre Dubois",
		role: "Ostéopathe",
		quote: "Une interface simple et intuitive, parfaitement adaptée à mes besoins. Je recommande !",
		image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
	},
];

const valueProps = [
	{
		title: "Gagner du temps",
		description:
			"Automatisez les tâches répétitives et concentrez-vous sur l'essentiel.",
		icon: <Clock className="w-8 h-8" />,
	},
	{
		title: "Organisation optimale",
		description:
			"Centralisez toutes les informations de votre cabinet en un seul endroit.",
		icon: <Users className="w-8 h-8" />,
	},
	{
		title: "Développement",
		description: "Gérez votre activité efficacement depuis n'importe où.",
		icon: <FileText className="w-8 h-8" />,
	},
	{
		title: "Tranquillité d'esprit",
		description: "Un outil fiable et sécurisé pour votre cabinet.",
		icon: <CheckCircle className="w-8 h-8" />,
	},
];

export default App;
