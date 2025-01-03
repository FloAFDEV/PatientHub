import React, { useEffect, useState, useMemo } from "react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import {
	IconChartBar,
	IconUsers,
	IconClock,
	IconUserPlus as IconNewUser,
	IconCalendar,
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
	Line,
	LineChart,
} from "recharts";

interface DashboardProps {
	user: User | null;
}

interface DashboardData {
	totalPatients: number;
	maleCount: number;
	femaleCount: number;
	patients30DaysAgo: number;
	averageAge: number;
	averageAgeMale: number;
	averageAgeFemale: number;
	newPatientsThisMonth: number;
	newPatientsThisYear: number;
	newPatientsLastYear: number;
	appointmentsToday: number;
	nextAppointment: string;
	monthlyGrowth: {
		month: string;
		patients: number;
		prevPatients: number;
		growthText: string;
	}[];
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
				if (!response.ok) {
					throw new Error(
						`Erreur serveur: ${response.status} - ${response.statusText}`
					);
				}
				const data = await response.json();

				if (
					isMounted &&
					JSON.stringify(data) !== JSON.stringify(dashboardData)
				) {
					setDashboardData(data);
				}
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des données:",
					error instanceof Error ? error.message : error
				);
			}
		};
		fetchDashboardData();
		// Cleanup function pour éviter les mises à jour après démontage
		return () => {
			isMounted = false;
		};
	}, [dashboardData]);

	// Données pour la répartition des Hommes/Femmes
	const genderData = useMemo(
		() => [
			{ name: "Hommes", value: dashboardData?.maleCount || 0 },
			{ name: "Femmes", value: dashboardData?.femaleCount || 0 },
		],
		[dashboardData?.maleCount, dashboardData?.femaleCount]
	);

	// Données pour les âges moyens des hommes et des femmes
	const ageData = useMemo(
		() => [
			{
				name: "Hommes",
				Age: dashboardData?.averageAgeMale || 0,
				fill: "#4c50bf",
			},
			{
				name: "Femmes",
				Age: dashboardData?.averageAgeFemale || 0,
				fill: "#ed64a6",
			},
		],
		[dashboardData?.averageAgeMale, dashboardData?.averageAgeFemale]
	);

	const mapMonthToFrench = useMemo(() => {
		return (month: string): string => {
			const months: { [key: string]: string } = {
				January: "Janvier",
				February: "Février",
				March: "Mars",
				April: "Avril",
				May: "Mai",
				June: "Juin",
				July: "Juillet",
				August: "Août",
				September: "Septembre",
				October: "Octobre",
				November: "Novembre",
				December: "Décembre",
			};
			return months[month] || month;
		};
	}, []);

	return (
		<div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
			{/* En-tête de bienvenue */}
			<header className="mb-8">
				<div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden rounded-lg shadow-xl mb-8">
					<Image
						src="/assets/images/ModernCabinet.webp"
						alt="Image d'une clinique moderne d'ostéopathie"
						fill
						style={{
							objectFit: "cover",
							objectPosition: "center 60%",
							aspectRatio: "16/9",
						}}
						className="opacity-80"
						priority
						placeholder="blur"
						blurDataURL="/assets/images/ModernCabinet-small.webp"
					/>
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 bg-black bg-opacity-40 rounded-lg">
						<Image
							src="/assets/icons/logo-full.svg"
							alt="Logo de PatientHub"
							width={80}
							height={80}
							className="object-contain shadow-xl rounded-xl mb-4"
							loading="lazy"
						/>
						<h1 className="mt-2 text-3xl font-bold drop-shadow-sm">
							Bienvenue,{" "}
							{user?.user_metadata?.user_metadata?.first_name ||
								user?.email ||
								"Utilisateur"}
						</h1>
						<p className="text-xl drop-shadow-md">
							Tableau de bord
						</p>
					</div>
				</div>
			</header>

			{/* Section des statistiques */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
				<StatCard
					icon={
						<div className="flex items-center justify-center w-8 h-8">
							<IconUsers
								className="w-full h-full text-blue-500"
								aria-hidden="true"
							/>
						</div>
					}
					title="Patients actifs"
					value={
						dashboardData?.totalPatients !== undefined
							? dashboardData.totalPatients
							: "Chargement..."
					}
					change={(() => {
						const currentPatients = dashboardData?.totalPatients;
						const patients30DaysAgo =
							dashboardData?.patients30DaysAgo;

						if (
							currentPatients !== undefined &&
							patients30DaysAgo !== undefined
						) {
							// Calcul du pourcentage d'augmentation, avec une valeur minimale de 0
							const increase =
								patients30DaysAgo !== 0
									? ((currentPatients - patients30DaysAgo) /
											patients30DaysAgo) *
									  100
									: 0;
							return `+ ${Math.max(increase, 0).toFixed(
								0
							)}% sur 30 jours`;
						}

						return "Chargement...";
					})()}
				/>

				<StatCard
					icon={
						<div className="flex items-center justify-center w-8 h-8">
							<IconClock
								className="w-full h-full text-green-500"
								aria-hidden="true"
							/>
						</div>
					}
					title="Rendez-vous aujourd'hui"
					value="8"
					subtitle="Prochain RDV à 14h30"
				/>
				<StatCard
					icon={
						<div className="flex items-center justify-center w-10 h-10">
							<IconNewUser
								className="w-full h-full text-purple-500"
								aria-hidden="true"
							/>
						</div>
					}
					title="Nouveaux patients (Ce mois-ci)"
					value={
						dashboardData?.newPatientsThisMonth !== undefined
							? dashboardData.newPatientsThisMonth
							: "Chargement..."
					}
				/>
				<StatCard
					icon={
						<div className="flex items-center justify-center w-10 h-10">
							<IconNewUser
								className="w-full h-full text-purple-500"
								aria-hidden="true"
							/>
						</div>
					}
					title="Nouveaux patients (Cette année)"
					value={
						dashboardData?.newPatientsThisYear !== undefined
							? dashboardData.newPatientsThisYear.toString()
							: "Chargement..."
					}
					change={
						dashboardData?.newPatientsLastYear !== undefined &&
						dashboardData.newPatientsLastYear !== 0
							? (() => {
									const currentYearPatients =
										dashboardData.newPatientsThisYear;
									const lastYearPatients =
										dashboardData.newPatientsLastYear;

									if (
										lastYearPatients !== 0 &&
										currentYearPatients !== undefined
									) {
										let growth =
											((currentYearPatients -
												lastYearPatients) /
												lastYearPatients) *
											100;

										// Si la croissance est négative, afficher 0%
										if (growth < 0) {
											growth = 0;
										}

										return `+ ${growth.toFixed(
											0
										)}% sur l'année en cours`;
									}
									return "Pas de comparaison";
							  })()
							: undefined
					}
				/>

				<StatCard
					icon={
						<div className="flex items-center justify-center w-10 h-10">
							<IconChartBar
								className="w-full h-full text-yellow-500"
								aria-hidden="true"
							/>
						</div>
					}
					title="Âge moyen des patients"
					value={
						dashboardData?.averageAge
							? `${dashboardData.averageAge.toFixed(1)} ans`
							: "Chargement..."
					}
					subtitle=""
				/>
			</div>

			{/* Section des graphiques */}
			<section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 ">
				<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8 text-center">
					Graphiques et visualisations
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
					{/* Graphique pour l'âge moyen des hommes et des femmes */}
					<div className="bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-3 sm:p-6 rounded-lg shadow-lg">
						<h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-white text-center flex items-center justify-center gap-2">
							<IconCalendar
								className="text-indigo-600 dark:text-indigo-400"
								size={20}
							/>
							Âge moyen des patients
						</h3>
						<ResponsiveContainer width="100%" height={250}>
							<BarChart
								aria-label="Répartition des âges des patients"
								data={ageData}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#ccc"
								/>
								<XAxis
									dataKey="name"
									tick={{ fill: "#A0AEC0", fontSize: 14 }}
								/>
								<YAxis
									domain={[0, "dataMax + 5"]}
									tick={{ fill: "#A0AEC0", fontSize: 12 }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "#f8fafc",
									}}
								/>
								<Bar dataKey="Age" barSize={70} fill="#4C51BF">
									<LabelList
										dataKey="Age"
										position="insideTop"
										formatter={(value: number) =>
											`${value} ans`
										}
										fontSize={12}
										fill="#fff"
									/>
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
					{/* Graphique pour la répartition Hommes/Femmes */}
					<div className="bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-3 sm:p-6 rounded-lg shadow-lg">
						<h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-white text-center flex items-center justify-center gap-2">
							<IconUsers
								className="text-pink-500 dark:text-pink-300"
								aria-hidden="true"
								size={20}
							/>
							Répartition Hommes/Femmes
						</h3>
						<ResponsiveContainer
							width="100%"
							height={200}
							className="sm:height-[300px]"
						>
							<PieChart>
								<Pie
									data={genderData}
									cx="50%"
									cy="50%"
									innerRadius={50}
									outerRadius={70}
									paddingAngle={5}
									dataKey="value"
								>
									{genderData.map((_entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												index === 0
													? "#4C51BF"
													: "#ED64A6"
											}
										/>
									))}
									<LabelList
										dataKey="value"
										position="inside"
										fontSize={12}
										fill="#fff"
										fontWeight="thin"
									/>
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: "#f8fafc",
										border: "none",
										borderRadius: "8px",
										boxShadow:
											"0 4px 6px rgba(0, 0, 0, 0.1)",
									}}
								/>
								<Legend
									wrapperStyle={{ paddingTop: "10px" }}
									formatter={(value, _entry, index) => (
										<span
											className={`${
												index === 0
													? "text-indigo-600 dark:text-indigo-400"
													: "text-pink-500 dark:text-pink-300"
											} font-normal`}
										>
											{value}
										</span>
									)}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
				<div className="w-full mt-8">
					{/* Graphique pour la croissance mensuelle */}
					<div className="bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-3 sm:p-6 rounded-lg shadow-lg">
						<h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-white text-center flex items-center justify-center gap-2">
							<IconChartBar
								className="text-purple-700"
								aria-hidden="true"
								size={20}
							/>
							Croissance mensuelle des patients en{" "}
							{new Date().getFullYear()}
						</h3>
						<ResponsiveContainer width="100%" height={250}>
							<LineChart
								aria-label="Évolution des rendez-vous au fil des mois"
								data={(dashboardData?.monthlyGrowth || []).map(
									(item) => ({
										month: mapMonthToFrench(item.month),
										patients: item.patients,
										growthText: item.growthText,
									})
								)}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#ccc"
								/>
								<XAxis
									dataKey="month"
									tick={{ fill: "#A0AEC0", fontSize: 12 }}
								/>
								<YAxis
									tick={{ fill: "#A0AEC0", fontSize: 12 }}
									domain={[0, "auto"]}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "#bf4cbb",
										border: "none",
										borderRadius: "8px",
										boxShadow:
											"0 4px 6px rgba(0, 0, 0, 0.1)",
									}}
									itemStyle={{
										color: "#ffffff",
										fontSize: "14px",
									}}
									formatter={(_value, _name, props) => {
										const patients =
											props.payload?.patients || 0;
										const growthText =
											props.payload?.growthText || "";
										return [
											`Total de ${patients} 👥`,
											growthText
												? growthText
												: "Pas de comparaison disponible",
										];
									}}
								/>

								<Line
									type="monotone"
									dataKey="patients"
									stroke="rgb(76, 80, 191)"
									strokeWidth={3}
								/>
							</LineChart>
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
		<p className="text-3xl lg:text-3xl sm:text-2xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
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

StatCard.displayName = "StatCard";

export default Dashboard;
