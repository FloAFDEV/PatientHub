import Image from "next/image";
import Link from "next/link";
import { PasskeyModal } from "@/components/PassKeyModal";
import { SearchParamProps } from "@/components/types/index";

const Home = ({ searchParams }: SearchParamProps) => {
	const isAdmin = searchParams?.admin === "true";

	return (
		<div className="flex flex-col lg:flex-row h-screen max-h-screen bg-gradient-to-r from-sky-800 to-gray-300">
			{isAdmin && <PasskeyModal />}

			<section className="flex-1 flex flex-col justify-center items-center bg-transparent container px-4 md:px-8 py-8 lg:py-12">
				<div className="max-w-md w-full text-center">
					<Image
						src="/assets/icons/logo-full.svg"
						height={96}
						width={162}
						alt="Franck BLANCHET Ostéopathie"
						className="h-auto mt-12 sm:mt-16 lg:mt-20 w-[150px] sm:w-[155px] md:w-[162px] rounded-2xl mb-20 sm:mb-32 lg:mb-48 shadow-gray-600 shadow-2xl"
					/>

					<h1 className="header mb-10 sm:mb-8 md:mb-10 text-2xl sm:text-3xl font-bold text-teal-300">
						Bienvenue chez{" "}
						<span className="text-yellow-500 font-extrabold">
							Franck BLANCHET
						</span>
						<span> Ostéopathie</span>
					</h1>

					<p className="text-slate-800 mb-8 sm:mb-10 text-base md:text-lg font-medium">
						Cette interface est réservée à l'administration.
					</p>

					<Link href="/?admin=true" className="mt-8">
						<button className="px-6 py-2 bg-sky-600 text-xl text-white drop-shadow-2xl shadow-teal-500 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
							Accès Administrateur
						</button>
					</Link>
				</div>

				{/* Section pour les droits réservés */}
				<footer className="mt-auto mb-4">
					<p className="text-slate-900 text-sm md:text-base">
						© 2024 Franck BLANCHET. Tous droits réservés.
					</p>
				</footer>
			</section>

			<Image
				src="/assets/images/onboarding-img.png"
				height={1000}
				width={1000}
				alt="Image d'accueil"
				className="max-w-[50%] hidden lg:block object-cover"
			/>
		</div>
	);
};

export default Home;
