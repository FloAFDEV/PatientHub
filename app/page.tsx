import Image from "next/image";
import Link from "next/link";
import { PasskeyModal } from "@/components/PassKeyModal";
import { SearchParamProps } from "@/components/types/index";
import Footer from "@/components/Footer";

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
						className="h-auto mt-12 sm:mt-16 lg:mt-20 w-[150px] sm:w-[155px] md:w-[162px] rounded-2xl mb-10 sm:mb-20 lg:mb-32 shadow-gray-600 shadow-2xl"
					/>

					{/* Section de bienvenue révisée */}
					<div className="bg-opacity-90 p-6 rounded-lg mb-8">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-200 mb-2">
							Bienvenue chez{" "}
							<span className="text-yellow-500 font-extrabold">
								Franck BLANCHET
							</span>
						</h1>
						<span className="text-lg sm:text-xl font-medium text-slate-800">
							Ostéopathie
						</span>
					</div>

					<p className="text-slate-800 mb-6 sm:mb-8 text-base md:text-lg font-medium">
						Cette interface est réservée à l&apos;administration. Si
						vous êtes un patient, veuillez contacter le cabinet pour
						prendre rendez-vous.
					</p>

					<Link href="/?admin=true" className="mt-4">
						<button className="px-6 py-2 text-xl bg-sky-600 text-white drop-shadow-2xl shadow-teal-500 rounded-md hover:bg-sky-800">
							Accès Administrateur
						</button>
					</Link>
				</div>
				{/* Ajout du Footer */}
				<Footer />
			</section>

			<div className="hidden lg:block lg:w-1/2 relative">
				<Image
					src="/assets/images/onboarding-img.png"
					alt="Image d'accueil"
					fill
					className="object-cover"
				/>
			</div>
		</div>
	);
};

export default Home;
