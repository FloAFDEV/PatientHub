import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ClientMotion from "@/components/ClientMotion";
import Image from "next/image";
import Link from "next/link";

const features = [
	{
		title: "Gestion des patients",
		description:
			"Suivez facilement l'historique de chaque patient, centralisez les documents médicaux et accédez rapidement aux informations clés.",
		icon: "/assets/icons/patient.svg",
	},
	{
		title: "Planification intelligente",
		description:
			"Organisez vos rendez-vous en un clin d'œil grâce à un calendrier intuitif et personnalisable. Optimisez votre temps et réduisez les absences.",
		icon: "/assets/icons/calendar.svg",
	},
	{
		title: "Facturation automatisée",
		description:
			"Générez des factures professionnelles en quelques clics et suivez facilement vos paiements. Simplifiez votre comptabilité et gagnez en efficacité.",
		icon: "/assets/icons/invoice.svg",
	},
];

const testimonials = [
	{
		name: "Dr. Élise Martin",
		role: "Ostéopathe",
		comment:
			"PatientHub a transformé ma pratique ! La gestion des patients est un jeu d'enfant et la facturation est tellement plus rapide.",
		image: "/assets/images/testimonial1.jpg",
	},
	{
		name: "Dr. Lucas Dubois",
		role: "Ostéopathe",
		comment:
			"L'interface est intuitive et l'équipe de support est incroyable. Je recommande PatientHub à tous mes confrères.",
		image: "/assets/images/testimonial2.jpg",
	},
];

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
			<Navbar />

			{/* Hero Section */}
			<header className="relative pt-40 pb-32 px-6 rounded-b-3xl shadow-2xl overflow-hidden bg-slate-900 text-white">
				<div className="absolute inset-0 bg-[url('/assets/background/grain-bg.svg')] bg-repeat opacity-70" />
				<div className="absolute inset-0 bg-[url('/assets/background/grain-blur.svg')] bg-repeat opacity-90" />
				<ClientMotion
					initial={{ opacity: 0, y: -40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.9, ease: "easeInOut" }}
					className="relative z-10"
				>
					<div className="max-w-6xl mx-auto text-center">
						<h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 text-white">
							<span className="text-6xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
								PatientHub
							</span>{" "}
							La solution idéale
							<br />
							pour les ostéopathes
						</h1>
						<p className="mt-6 text-xl max-w-4xl mx-auto text-gray-500 opacity-90">
							Simplifiez la gestion de votre cabinet et
							concentrez-vous sur vos patients. Essayez PatientHub
							gratuitement !
						</p>
						<div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:space-x-6">
							<Link href="/signup">
								<Button className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full transform hover:scale-105 transition duration-300 ease-in-out">
									Découvrir PatientHub gratuitement
								</Button>
							</Link>
							<Link href="/login">
								<Button
									variant="outline"
									className="w-full sm:w-auto px-8 py-6 text-lg font-semibold shadow-lg rounded-full transform hover:scale-105 transition duration-300 ease-in-out"
								>
									Déjà inscrit ? Se connecter
								</Button>
							</Link>
						</div>
					</div>
				</ClientMotion>{" "}
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
				<h2 className="text-center text-4xl font-bold text-gray-900 mb-16">
					Les fonctionnalités clés de PatientHub
				</h2>
				<div className="grid md:grid-cols-3 gap-16">
					{features.map((feature, index) => (
						<ClientMotion
							key={index}
							className="text-gray-800 rounded-2xl p-10 shadow-md hover:shadow-xl transform hover:-translate-y-3 transition duration-300 ease-in-out flex flex-col items-center text-center border border-gray-200"
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7, delay: index * 0.2 }}
						>
							<div className="w-48 h-48 mb-8 relative rounded-xl bg-gray-100 p-4">
								<Image
									src={feature.icon}
									alt={feature.title}
									fill
									className="object-contain"
								/>
							</div>
							<h3 className="text-2xl font-semibold mb-4">
								{feature.title}
							</h3>
							<p className="mt-4 text-gray-600 text-lg">
								{feature.description}
							</p>
						</ClientMotion>
					))}
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-24 bg-gray-50">
				<div className="container mx-auto px-6">
					<h2 className="text-center text-4xl font-bold text-gray-900 mb-16 ">
						Ce que nos utilisateurs disent
					</h2>
					<div className="grid md:grid-cols-2 gap-12">
						{testimonials.map((testimonial, index) => (
							<ClientMotion
								key={index}
								className="bg-white rounded-2xl p-10 shadow-md flex items-start border border-gray-200"
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
									width={96}
									height={96}
									className="w-24 rounded-full mr-8 object-cover shadow-md"
								/>
								<div>
									<h4 className="text-xl font-semibold text-gray-900">
										{testimonial.name}
									</h4>
									<p className="text-gray-600 text-lg mb-2">
										{testimonial.role}
									</p>
									<p className="mt-2 text-gray-700 italic text-lg">
										&quot;{testimonial.comment}&quot;
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
					<h2 className="text-4xl font-bold text-gray-900 mb-8">
						Pourquoi PatientHub est indispensable ?
					</h2>
					<p className="text-xl text-gray-700 max-w-4xl mx-auto mb-12">
						PatientHub vous offre une solution complète pour :
					</p>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="p-6 bg-gray-50 rounded-2xl shadow-md border border-gray-200">
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Gagner du temps
							</h3>
							<p className="text-gray-600 text-lg">
								Automatisez les tâches répétitives et
								concentrez-vous sur vos patients.
							</p>
						</div>
						<div className="p-6 bg-gray-50 rounded-2xl shadow-md border border-gray-200">
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Améliorer l&apos;organisation
							</h3>
							<p className="text-gray-600 text-lg">
								Centralisez toutes les informations de votre
								cabinet en un seul endroit.
							</p>
						</div>
						<div className="p-6 bg-gray-50 rounded-2xl shadow-md border border-gray-200">
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
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
					<h2 className="text-4xl font-bold text-gray-900 mb-8">
						Essayez PatientHub gratuitement (pour le moment !)
					</h2>
					<p className="text-xl text-gray-700 max-w-4xl mx-auto mb-12">
						Profitez de toutes les fonctionnalités de PatientHub
						gratuitement pendant une période limitée. Ne manquez pas
						cette opportunité de simplifier votre pratique
						ostéopathique.
					</p>
					<Link href="/signup">
						<Button className="px-14 py-6 text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full transform hover:scale-105 transition duration-300 ease-in-out">
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
					<h2 className="text-4xl font-bold text-gray-900 mb-8">
						Votre avis compte !
					</h2>
					<p className="text-xl text-gray-700 max-w-4xl mx-auto mb-12">
						Nous sommes constamment en train d&apos;améliorer
						PatientHub et votre feedback est essentiel. Partagez vos
						idées, vos suggestions et vos besoins pour nous aider à
						créer la meilleure plateforme pour les ostéopathes.
					</p>
					<Link href="/feedback">
						<Button className="px-14 py-6 text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full transform hover:scale-105 transition duration-300 ease-in-out">
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
					<h2 className="text-4xl font-bold text-gray-900 mb-8">
						Simplifiez votre pratique ostéopathique dès
						aujourd&apos;hui !
					</h2>
					<p className="text-xl max-w-4xl mx-auto text-gray-700 mb-12">
						Rejoignez une communauté d&apos;ostéopathes qui ont
						choisi PatientHub pour simplifier leur quotidien et
						offrir un service exceptionnel à leurs patients.
					</p>
					<Link href="/signup">
						<Button className="px-14 py-6 text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full transform hover:scale-105 transition duration-300 ease-in-out">
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
