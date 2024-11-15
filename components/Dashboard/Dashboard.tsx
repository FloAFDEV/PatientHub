"use client";

import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import {
	IconChartBar,
	IconUsers,
	IconClock,
	IconUserPlus as IconNewUser,
} from "@tabler/icons-react";

import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LabelList,
} from "recharts";

interface DashboardProps {
	user: User | null;
}

interface DashboardData {
	totalPatients: number;
	maleCount: number;
	femaleCount: number;
	averageAge: number;
	averageAgeMale: number;
	averageAgeFemale: number;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null
	);

	useEffect(() => {
		let isMounted = true;
		const fetchDashboardData = async () => {
			try {
				const response = await fetch("/api/dashboard");
				const data = await response.json();
				if (isMounted) {
					setDashboardData(data);
				}
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des données du tableau de bord",
					error
				);
			}
		};
		fetchDashboardData();
		return () => {
			isMounted = false;
		};
	}, []);

	// Données pour la répartition des Hommes/Femmes
	const genderData = [
		{ name: "Hommes", value: dashboardData?.maleCount || 0 },
		{ name: "Femmes", value: dashboardData?.femaleCount || 0 },
	];

	// Données pour les âges moyens des hommes et des femmes
	const ageData = [
		{
			name: "Hommes",
			age: dashboardData?.averageAgeMale || 0,
			fill: "#0088FE", // Bleu pour les hommes
		},
		{
			name: "Femmes",
			age: dashboardData?.averageAgeFemale || 0,
			fill: "#EC4899", // Rose pour les femmes
		},
	];

	return (
		<div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
			{/* En-tête de bienvenue */}
			<header className="mb-8">
				<div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden rounded-lg shadow-lg mb-8">
					<Image
						src="/assets/images/ModernCabinet.webp"
						alt="Modern Osteopathy Clinic"
						layout="fill"
						objectFit="cover"
						objectPosition="center 60%"
						className="opacity-80"
						priority
					/>
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 bg-black bg-opacity-40 rounded-lg">
						<Image
							src="/assets/icons/logo-full.svg"
							alt="Logo"
							width={80}
							height={80}
							className="object-contain shadow-xl rounded-xl mb-4"
							priority
						/>
						<h1 className="text-3xl font-bold drop-shadow-md">
							Tableau de bord
						</h1>
						<p className="mt-2 text-xl drop-shadow-sm">
							Bienvenue,{" "}
							{user?.user_metadata?.user_metadata?.first_name ||
								user?.email ||
								"Utilisateur"}
						</p>
					</div>
				</div>
			</header>

			{/* Section des statistiques */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
				<StatCard
					icon={
						<IconUsers className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mr-2" />
					}
					title="Patients actifs"
					value={dashboardData?.totalPatients || "Chargement..."}
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
				<StatCard
					icon={
						<IconChartBar className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mr-2" />
					}
					title="Âge moyen"
					value={
						dashboardData?.averageAge?.toFixed(1) || "Chargement..."
					}
					subtitle="ans"
				/>
			</div>

			{/* Section des graphiques */}
			<section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
				<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
					Graphiques et visualisations
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Graphique pour l'âge moyen des hommes et des femmes */}
					<div>
						<h3 className="text-lg font-semibold mb-2">
							Âge moyen des patients
						</h3>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={ageData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis domain={["auto", "auto"]} />
								<Tooltip />
								<Legend />
								<Bar dataKey="age" barSize={60} fill="#8884d8">
									<LabelList
										dataKey="age"
										position="insideTop"
										fontSize={14}
										fill="#fff"
									/>
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>

					{/* Graphique pour la répartition Hommes/Femmes */}
					<div>
						<h3 className="text-lg font-semibold mb-2 text-center">
							Répartition Hommes/Femmes
						</h3>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={genderData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={80}
									fill="#8884d8"
									paddingAngle={5}
									dataKey="value"
								>
									{genderData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												index === 0
													? "#0088FE"
													: "#EC4899"
											}
										/>
									))}{" "}
									<LabelList
										dataKey="value"
										position="inside"
										fontSize={14}
										fill="#fff"
									/>
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			</section>
		</div>
	);
};

// Composant pour afficher les cartes de statistiques
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
	subtitle,
}) => (
	<div className="bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
		<div className="flex items-center justify-between mb-3">
			<div className="flex items-center">
				{icon}
				<h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white ml-2">
					{title}
				</h3>
			</div>
		</div>
		<p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
			{value}
		</p>
		<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
			{change && (
				<p className="text-sm sm:text-base text-green-600 dark:text-green-400 mb-1 sm:mb-0">
					{change}
				</p>
			)}
			{subtitle && (
				<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
					{subtitle}
				</p>
			)}
		</div>
	</div>
);

export default Dashboard;
