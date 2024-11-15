"use client";

import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import PatientList from "../PatientList/PatientList";
import {
	IconUserPlus,
	IconCalendar,
	IconList,
	IconChartBar,
	IconUsers,
	IconClock,
	IconUserPlus as IconNewUser,
} from "@tabler/icons-react";

interface DashboardProps {
	user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
	const [patientCount, setPatientCount] = useState<number | null>(null);

	useEffect(() => {
		let isMounted = true;
		const fetchPatientCount = async () => {
			try {
				const response = await fetch("/api/patients?page=1");
				const data = await response.json();
				if (isMounted) {
					setPatientCount(data.totalPatients);
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
		<div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
			<header className="mb-8">
				<div className="flex items-center justify-between mt-8">
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
						Tableau de bord
					</h1>
					<Image
						src="/assets/icons/logo-full.svg"
						alt="Logo"
						width={80}
						height={80}
						className="object-contain shadow-xl rounded-xl mr-8"
						priority
					/>
				</div>
				<p className="mt-2 text-gray-600 dark:text-gray-400">
					Bienvenue,{" "}
					{user?.user_metadata?.user_metadata?.first_name ||
						user?.email ||
						"Utilisateur"}
				</p>
			</header>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
				<StatCard
					icon={
						<IconUsers className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mr-2" />
					}
					title="Patients actifs"
					value={
						patientCount !== null ? patientCount : "Chargement..."
					}
					change="+12%"
				/>
				<StatCard
					icon={
						<IconClock className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-2" />
					}
					title="Rendez-vous aujourd'hui"
					value="8"
					subtitle="Prochain RDV à 14h30"
				/>
				<StatCard
					icon={
						<IconNewUser className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mr-2" />
					}
					title="Nouveaux patients"
					value="24"
					subtitle="Ce mois-ci"
				/>
			</div>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
					Actions rapides
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					<ActionButton
						icon={IconUserPlus}
						text="Ajouter un patient"
						color="blue"
					/>
					<ActionButton
						icon={IconCalendar}
						text="Voir les rendez-vous"
						color="green"
					/>
					<ActionButton
						icon={IconList}
						text="Voir le listing patient"
						color="purple"
					/>
					<ActionButton
						icon={IconChartBar}
						text="Rapports mensuels"
						color="yellow"
					/>
				</div>
			</section>
			<section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
				<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
					Graphiques et visualisations
				</h2>
				<p className="text-gray-600 dark:text-gray-400">
					Contenu supplémentaire, comme des graphiques, des
					tableaux...
				</p>
				<div className="overflow-auto max-w-lg max-h-96">
					<PatientList initialPatients={[]} user={user} />
				</div>
			</section>
		</div>
	);
};

interface StatCardProps {
	icon: React.ReactNode;
	title: string;
	value: string | number;
	change?: string;
	subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
	icon,
	title,
	value,
	change,
	subtitle = "",
}) => (
	<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
		<div className="flex items-center justify-between mb-4">
			{icon}
			<h3 className="text-lg font-semibold text-gray-800 dark:text-white">
				{title}
			</h3>
		</div>
		<p className="text-3xl font-bold text-gray-900 dark:text-white">
			{value}
		</p>
		{change && (
			<p className="mt-2 text-sm text-green-600 dark:text-green-400">
				{change}
			</p>
		)}
		{subtitle && (
			<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
				{subtitle}
			</p>
		)}
	</div>
);

interface ActionButtonProps {
	icon: React.ElementType;
	text: string;
	color: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
	icon: Icon,
	text,
	color,
}) => (
	<button
		className={`${
			color === "blue"
				? "bg-blue-500 hover:bg-blue-600"
				: color === "green"
				? "bg-green-500 hover:bg-green-600"
				: color === "purple"
				? "bg-purple-500 hover:bg-purple-600"
				: color === "yellow"
				? "bg-yellow-500 hover:bg-yellow-600"
				: "bg-gray-500 hover:bg-gray-600"
		} text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center`}
	>
		<Icon className="mr-2" size={20} />
		<span>{text}</span>
	</button>
);

export default Dashboard;
