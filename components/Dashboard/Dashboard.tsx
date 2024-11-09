"use client";

import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import {
	IconUserPlus,
	IconCalendar,
	IconList,
	IconChartBar,
} from "@tabler/icons-react";
import AddPatientForm from "@/components/addPatientForm/addPatientForm";

interface DashboardProps {
	user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
	// Déclarez un état pour stocker le nombre de patients
	const [patientCount, setPatientCount] = useState<number | null>(null);

	// Utilisez useEffect pour appeler l'API lors du rendu du composant
	useEffect(() => {
		let isMounted = true;
		const fetchPatientCount = async () => {
			try {
				const response = await fetch("/api/patients?page=1");
				const data = await response.json();
				if (isMounted) {
					setPatientCount(data.patientsCount);
				}
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des patients",
					error
				);
			}
		};
		fetchPatientCount();
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className="flex-1 p-4 sm:p-6 md:p-10 bg-gray-100 dark:bg-gray-900 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 mt-10 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6 flex items-center justify-between">
				<div className="flex flex-col max-w-[75%]">
					<h1 className="text-2xl sm:text-3xl font-bold mb-2">
						Bienvenue,{" "}
						{user
							? user.user_metadata?.user_metadata?.first_name ||
							  user.email
							: "Utilisateur"}
					</h1>
					<p className="text-base sm:text-lg">
						Voici un aperçu de votre tableau de bord
					</p>
				</div>
				<div className="flex-shrink-0 ml-4 relative">
					<Image
						src="/assets/icons/logo-full.svg"
						alt="Logo"
						width={200}
						height={200}
						className="object-contain rounded-xl w-[100px] sm:w-[180px] md:w-[200px] lg:w-[210px] xl:w-[200px] md:ml-4"
						priority
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
				{/* Section des patients actifs */}
				<div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4">
						Patients actifs
					</h2>
					<p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
						{patientCount !== null ? patientCount : "Chargement..."}
					</p>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						+12% par rapport au mois dernier
					</p>
				</div>

				{/* Autres sections */}
				<div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4">
						Rendez-vous aujourd&apos;hui
					</h2>
					<p className="text-3xl font-bold text-green-600 dark:text-green-400">
						8
					</p>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Prochain RDV à 14h30
					</p>
				</div>
				<div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4">
						Nouveaux patients
					</h2>
					<p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
						24
					</p>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Ce mois-ci
					</p>
				</div>
			</div>

			{/* Actions rapides */}
			<div className="mt-6 sm:mt-8">
				<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
					Actions rapides
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					<button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm sm:text-base flex items-center justify-center">
						<IconUserPlus className="mr-2" /> Ajouter un patient
					</button>
					<button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm sm:text-base flex items-center justify-center">
						<IconCalendar className="mr-2" /> Voir les rendez-vous
					</button>
					<button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm sm:text-base flex items-center justify-center">
						<IconList className="mr-2" /> Voir le listing patient
					</button>
					<button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm sm:text-base flex items-center justify-center">
						<IconChartBar className="mr-2" /> Rapports mensuels
					</button>
				</div>
			</div>

			{/* Graphiques et autres visualisations */}
			<div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg mt-4 sm:mt-6">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4">
					Graphiques et autres visualisations
				</h2>
				<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
					Contenu supplémentaire, comme des graphiques, des
					tableaux...
				</p>
			</div>

			<AddPatientForm />
		</div>
	);
};

export default Dashboard;
