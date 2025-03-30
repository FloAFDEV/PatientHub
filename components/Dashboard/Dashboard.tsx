import React, { useEffect, useState, useMemo } from "react";
import { User } from "@supabase/supabase-js";
import StatCard from "../StatCard";
import Image from "next/image";
import {
	IconChartBar,
	IconUsers,
	IconClock,
	IconUserPlus as IconNewUser,
	IconCalendar,
} from "@tabler/icons-react";

// Composants de charting "recharts"
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

/**
 * Types & interfaces
 * ------------------
 * On peut ajuster `DashboardData` selon les champs exacts
 * retournés par l'API `/api/dashboard`.
 */
interface DashboardData {
	totalPatients: number;
	maleCount: number;
	femaleCount: number;
	averageAge: number;
	averageAgeMale: number;
	averageAgeFemale: number;
	newPatientsThisMonth: number;
	newPatientsThisYear: number;
	newPatientsLastYear: number;
	appointmentsToday: number;
	nextAppointment: string;
	patientsLastYearEnd: number;
	newPatientsLast30Days: number;
	thirtyDayGrowthPercentage: number;
	annualGrowthPercentage: number;
	monthlyGrowth: {
		month: string;
		patients: number;
		prevPatients: number;
		growthText: string;
	}[];
}

interface DashboardProps {
	user: User | null;
}

/**
 * Composant Dashboard
 * -------------------
 * Affiche un tableau de bord avec différentes statistiques et graphiques
 * basés sur les données renvoyées par l'API "/api/dashboard".
 */
const Dashboard: React.FC<DashboardProps> = ({ user }) => {
	// État pour stocker les données du dashboard
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null
	);

	// État pour gérer l'affichage d'un loader pendant le chargement
	const [loading, setLoading] = useState<boolean>(true);

	/**
	 * useEffect: on déclenche la récupération des données au montage du composant.
	 * `isMounted` est utilisé pour éviter de modifier l'état quand le composant
	 * est déjà démonté (précaution).
	 */
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

				/**
				 * Vérifie si le composant est toujours monté et si les données ont changé.
				 * On met à jour l'état local, et on arrête le "loading".
				 */
				if (
					isMounted &&
					JSON.stringify(data) !== JSON.stringify(dashboardData)
				) {
					setDashboardData(data);
					setLoading(false);
				}
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des données:",
					error instanceof Error ? error.message : error
				);
				setLoading(false); // En cas d'erreur, on arrête aussi le "loading".
			}
		};

		fetchDashboardData();

		// Nettoyage pour éviter toute mise à jour d'état si le composant est démonté
		return () => {
			isMounted = false;
		};
	}, [dashboardData]);

	/**
	 * Rassemble les données de répartition par genre (homme/femme)
	 * au format attendu par le <PieChart>.
	 */
	const genderData = useMemo(
		() => [
			{ name: "Hommes", value: dashboardData?.maleCount || 0 },
			{ name: "Femmes", value: dashboardData?.femaleCount || 0 },
		],
		[dashboardData?.maleCount, dashboardData?.femaleCount]
	);

	/**
	 * Données pour l'affichage de l'âge moyen (homme/femme).
	 * On stocke aussi la couleur directement dans l'objet de données.
	 */
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

	/**
	 * Petite fonction de mapping pour traduire les mois en français.
	 * (Par exemple "January" -> "Janvier", etc.)
	 */
	const mapMonthToFrench = useMemo(() => {
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

		return (month: string): string => months[month] || month;
	}, []);

	/**
	 * Affichage du loader si `loading === true`.
	 * On peut personnaliser la page de chargement ici
	 * ou simplement mettre un spinner, etc.
	 */
	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="w-full h-full flex justify-center items-center">
					{/* Différents anneaux animés pour faire un loader stylé */}
					<div className="absolute animate-ping h-[16rem] w-[16rem] rounded-full border-t-4 border-b-4 border-red-500 "></div>
					<div className="absolute animate-spin h-[14rem] w-[14rem] rounded-full border-t-4 border-b-4 border-purple-500 "></div>
					<div className="absolute animate-ping h-[12rem] w-[12rem] rounded-full border-t-4 border-b-4 border-pink-500 "></div>
					<div className="absolute animate-spin h-[10rem] w-[10rem] rounded-full border-t-4 border-b-4 border-yellow-500"></div>
					<div className="absolute animate-ping h-[8rem] w-[8rem] rounded-full border-t-4 border-b-4 border-green-500"></div>
					<div className="absolute animate-spin h-[6rem] w-[6rem] rounded-full border-t-4 border-b-4 border-blue-500"></div>
					<div className="rounded-full h-28 w-28 animate-bounce flex items-center justify-center text-gray-500 font-semibold text-3xl dark:text-gray-100">
						Chargement...
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Une fois les données chargées, on affiche le tableau de bord.
	 * Au besoin, ajustez les conditions "undefined" pour éviter les crashs
	 * si certaines données manquent.
	 */
	return (
		<div className="flex-1 p-3 bg-gray-50 dark:bg-gray-900">
			{/* En-tête de page / bannière */}
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
						blurDataURL="/assets/images/ModernCabinet.webp"
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

			{/* Section: Cartes de statistiques clés */}
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
					explanation="Vos patients au complet 🎉 (patients archivés ou décédés exclus)."
					value={
						dashboardData?.totalPatients !== undefined
							? dashboardData.totalPatients
							: "Chargement..."
					}
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
					value="8" // <-- vous pouvez brancher un champ de `dashboardData` si dispo
					subtitle="Prochain RDV à 14h30"
					explanation="Nombre total de rendez-vous pour la journée."
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
					title="Nouveaux patients (30 derniers jours)"
					explanation="Représente le nombre de nouveaux patients enregistrés ces 30 derniers jours."
					value={
						dashboardData?.newPatientsLast30Days !== undefined
							? dashboardData.newPatientsLast30Days
							: "Chargement..."
					}
					change={(() => {
						if (
							dashboardData?.thirtyDayGrowthPercentage !==
							undefined
						) {
							return `+${dashboardData.thirtyDayGrowthPercentage}% sur 30 jours`;
						}
						return "Chargement...";
					})()}
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
					explanation="Représente le nombre de nouveaux patients enregistrés cette année."
					value={
						dashboardData?.newPatientsThisYear !== undefined
							? dashboardData.newPatientsThisYear.toString()
							: "Chargement..."
					}
					change={
						dashboardData?.patientsLastYearEnd !== undefined &&
						dashboardData.patientsLastYearEnd !== 0
							? (() => {
									const growthPercentage =
										dashboardData.annualGrowthPercentage;
									const prefix =
										growthPercentage >= 0 ? "+" : "";
									return `${prefix}${growthPercentage}% depuis le 1er janvier`;
							  })()
							: "Pas de comparaison"
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
					explanation="Âge moyen calculé sur l'ensemble des patients actuellement suivis."
					value={
						dashboardData?.averageAge
							? `${dashboardData.averageAge.toFixed(1)} ans`
							: "Chargement..."
					}
					subtitle=""
				/>
			</div>

			{/* Section: Graphiques */}
			<section className="rounded-lg p-0">
				<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8 text-center">
					Graphiques et visualisations
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
					{/* Graphique 1: BarChart de l'âge moyen (hommes/femmes) */}
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
									tick={{ fill: "#A0AEC0", fontSize: 14 }}
									tickFormatter={(tick) => `${tick} ans`}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "#0891b2",
										border: "none",
										borderRadius: "8px",
										boxShadow:
											"0 4px 6px rgba(0, 0, 0, 0.1)",
									}}
									itemStyle={{
										color: "#ffffff",
										fontSize: "14px",
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

					{/* Graphique 2: PieChart de la répartition H/F */}
					<div className="bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-3 sm:p-6 rounded-lg shadow-lg">
						<h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-white text-center flex items-center justify-center gap-2">
							<IconUsers
								className="text-pink-500 dark:text-pink-300"
								aria-hidden="true"
								size={20}
							/>
							Répartition Hommes/Femmes
						</h3>
						<ResponsiveContainer width="100%" height={200}>
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
										backgroundColor: "#0891b2",
										border: "none",
										borderRadius: "8px",
										boxShadow:
											"0 4px 6px rgba(0, 0, 0, 0.1)",
									}}
									itemStyle={{
										color: "#ffffff",
										fontSize: "14px",
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

				{/* Graphique 3: Évolution mensuelle (LineChart) */}
				<div className="w-full mt-8">
					<div className="bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-3 sm:p-6 rounded-lg shadow-lg">
						<h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-white text-center flex items-center justify-center gap-2">
							<IconChartBar
								className="text-purple-700"
								aria-hidden="true"
								size={25}
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
										backgroundColor: "#0891b2",
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

export default Dashboard;
