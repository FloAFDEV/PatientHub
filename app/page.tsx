import ClientMotion from "@/components/ClientMotion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Clock, FileText, Users } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
			{/* Hero Section */}
			<header className="relative pt-24 pb-32 px-6 rounded-b-3xl shadow-2xl overflow-hidden bg-slate-900 text-white">
				<Link href="/" className="flex items-center space-x-2">
					<Image
						src="/assets/icons/logo-full.svg"
						alt="PatientHub"
						width={60}
						height={60}
						className="w-auto h-20 rounded-md"
					/>
					<span className="text-4xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
						PatientHub
					</span>
				</Link>
				<ClientMotion
					initial={{ opacity: 0, y: -40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.9, ease: "easeInOut" }}
					className="relative z-10 mt-12" // Ajout de mt-12 pour espacer du logo
				>
					<div className="max-w-6xl mx-auto text-center">
						<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 text-white">
							<span className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
								PatientHub
							</span>{" "}
							La solution idéale pour les ostéopathes
						</h1>
						<p className="mt-6 text-xl max-w-4xl mx-auto text-gray-500 opacity-90">
							Simplifiez la gestion de votre cabinet et
							concentrez-vous sur vos patients. Découvrez
							PatientHub gratuitement !
						</p>
						<div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:space-x-6">
							<Link href="/signup">
								<Button className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full transform hover:scale-105 transition duration-300 ease-in-out">
									Découvrir PatientHub gratuitement
								</Button>
							</Link>
							<Link href="/login">
								<Button
									variant="outline"
									className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg rounded-full transform hover:scale-105 transition duration-300 ease-in-out"
								>
									Déjà inscrit ? Se connecter
								</Button>
							</Link>
						</div>
					</div>
				</ClientMotion>
				{/* Espace pour les mockups */}
				<div className="relative z-10 mt-16 flex justify-center">
					<div className="w-full max-w-5xl bg-gray-200 rounded-xl h-96 flex items-center justify-center">
						<p className="text-gray-500 text-lg">
							Espace dédié aux mockups
						</p>
					</div>
				</div>
			</header>

			{/* Features Section */}
			<section className="py-24 px-6 container mx-auto">
				<h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
					Les fonctionnalités clés de PatientHub
				</h2>
				<div className="grid md:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<ClientMotion
							key={index}
							className="text-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transform hover:-translate-y-3 transition duration-300 ease-in-out flex flex-col items-start text-left border border-gray-200" // alignement à gauche
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7, delay: index * 0.2 }}
						>
							<div className="w-24 h-24 mb-6 relative rounded-xl bg-gray-100 p-4">
								{" "}
								{/* Taille réduite */}
								<Image
									src={feature.icon}
									alt={feature.title}
									fill
									className="object-contain"
								/>
							</div>
							<h3 className="text-xl font-semibold mb-2">
								{feature.title}
							</h3>{" "}
							{/* Taille réduite */}
							<p className="mt-2 text-gray-600 text-base">
								{feature.description}
							</p>{" "}
							{/* Taille réduite */}
						</ClientMotion>
					))}
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-24 bg-gray-50">
				<div className="container mx-auto px-6">
					<h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
						Ce que nos utilisateurs disent
					</h2>
					<div className="grid md:grid-cols-2 gap-8">
						{testimonials.map((testimonial, index) => (
							<ClientMotion
								key={index}
								className="bg-white rounded-2xl p-8 shadow-md flex items-start border border-gray-200"
								initial={{
									opacity: 0,
									x: index % 2 === 0 ? -60 : 60,
								}}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									duration: 0.8,
									delay: index * 0.3,
								}}
							>
								<Image
									src={testimonial.image}
									alt={testimonial.name}
									width={72} // Taille réduite
									height={72} // Taille réduite
									className="w-18 h-18 rounded-full mr-6 object-cover shadow-md"
								/>
								<div>
									<h4 className="text-lg font-semibold text-gray-900">
										{testimonial.name}
									</h4>{" "}
									{/* Taille réduite */}
									<p className="text-gray-600 text-base mb-2">
										{testimonial.role}
									</p>{" "}
									{/* Taille réduite */}
									<p className="mt-2 text-gray-700 italic text-base">
										"{testimonial.comment}"
									</p>
								</div>
							</ClientMotion>
						))}
					</div>
				</div>
			</section>

			{/* Added Value Proposition Section */}
			<section className="py-24 px-6 bg-white">
				<div className="container mx-auto text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-6">
						Pourquoi PatientHub est indispensable ?
					</h2>
					<p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
						PatientHub vous offre une solution complète pour :
					</p>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="p-6 bg-gray-50 rounded-2xl shadow-md border border-gray-200">
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								<Clock
									className="inline-block mr-2 align-middle text-blue-500"
									size={20}
								/>{" "}
								Gagner du temps
							</h3>
							<p className="text-gray-600 text-lg">
								Automatisez les tâches répétitives et
								concentrez-vous sur vos patients.
							</p>
						</div>
						<div className="p-6 bg-gray-50 rounded-2xl shadow-md border border-gray-200">
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								<Users
									className="inline-block mr-2 align-middle text-purple-500"
									size={20}
								/>{" "}
								Améliorer l'organisation
							</h3>
							<p className="text-gray-600 text-lg">
								Centralisez toutes les informations de votre
								cabinet en un seul endroit.
							</p>
						</div>
						<div className="p-6 bg-gray-50 rounded-2xl shadow-md border border-gray-200">
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								<FileText
									className="inline-block mr-2 align-middle text-pink-500"
									size={20}
								/>{" "}
								Développer votre activité
							</h3>
							<p className="text-gray-600 text-lg">
								Disponible sur mobile et toujours à portée de
								main, pour une gestion simplifiée dans votre
								poche.
							</p>
						</div>
						<div className="p-6 bg-gray-50 rounded-2xl shadow-md border border-gray-200">
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								<CheckCircle
									className="inline-block mr-2 align-middle text-green-500"
									size={20}
								/>{" "}
								Rester serein
							</h3>
							<p className="text-gray-600 text-lg">
								Confiez la gestion de votre cabinet à un outil
								fiable et sécurisé.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Pricing Section (NEW) */}
			<section className="py-24 px-6 bg-gray-50">
				<div className="container mx-auto text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-6">
						Essayez PatientHub gratuitement (pour le moment !)
					</h2>
					<p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
						Profitez de toutes les fonctionnalités de PatientHub
						gratuitement pendant une période limitée. Ne manquez pas
						cette opportunité de simplifier votre pratique
						ostéopathique.
					</p>
					<Link href="/signup">
						<Button className="px-12 py-4 text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full transform hover:scale-105 transition duration-300 ease-in-out">
							Commencer votre essai gratuit
						</Button>
					</Link>
					<p className="mt-4 text-gray-500 italic">
						Offre valable pour une durée limitée.
					</p>
				</div>
			</section>

			{/* Feedback Section (NEW) */}
			<section className="py-24 px-6 bg-white">
				<div className="container mx-auto text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-6">
						Votre avis compte !
					</h2>
					<p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
						Nous sommes constamment en train d'améliorer PatientHub
						et votre feedback est essentiel. Partagez vos idées, vos
						suggestions et vos besoins pour nous aider à créer la
						meilleure plateforme pour les ostéopathes.
					</p>
					<Link href="/feedback">
						<Button className="px-12 py-4 text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full transform hover:scale-105 transition duration-300 ease-in-out">
							Envoyer votre feedback
						</Button>
					</Link>
				</div>
			</section>

			{/* Call to Action Section */}
			<section className="bg-blue-100 py-32 text-center">
				<ClientMotion
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.7, ease: "easeOut" }}
				>
					<h2 className="text-3xl font-bold text-gray-900 mb-6">
						Simplifiez votre pratique ostéopathique dès aujourd'hui
						!
					</h2>
					<p className="text-xl max-w-4xl mx-auto text-gray-700 mb-8">
						Rejoignez une communauté d'ostéopathes qui ont choisi
						PatientHub pour simplifier leur quotidien et offrir un
						service exceptionnel à leurs patients.
					</p>
					<Link href="/signup">
						<Button className="px-12 py-4 text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full transform hover:scale-105 transition duration-300 ease-in-out">
							Découvrir PatientHub gratuitement
						</Button>
					</Link>
				</ClientMotion>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	);
}

const features = [
	{
		title: "Gestion simplifiée des patients",
		description:
			"Accédez rapidement à l'historique de vos patients, à leurs informations de contact et à leurs rendez-vous.",
		icon: "/assets/icons/feature-icons/management.svg",
	},
	{
		title: "Planning intuitif des rendez-vous",
		description:
			"Organisez facilement votre emploi du temps, visualisez vos disponibilités et envoyez des rappels automatiques à vos patients.",
		icon: "/assets/icons/feature-icons/calendar.svg",
	},
	{
		title: "Facturation automatisée",
		description:
			"Générez des factures professionnelles en quelques clics, suivez les paiements et simplifiez votre comptabilité.",
		icon: "/assets/icons/feature-icons/invoice.svg",
	},
];

const testimonials = [
	{
		name: "Dr. Élise Martin",
		role: "Ostéopathe",
		comment:
			"PatientHub a transformé ma façon de travailler. Je gagne un temps précieux et je peux me concentrer sur mes patients.",
		image: "/assets/images/testimonial-1.jpg",
	},
	{
		name: "Dr. Pierre Dubois",
		role: "Ostéopathe",
		comment:
			"L'interface est simple et intuitive, et les fonctionnalités sont parfaitement adaptées à mes besoins. Je recommande PatientHub à tous les ostéopathes.",
		image: "/assets/images/testimonial-2.jpg",
	},
];
