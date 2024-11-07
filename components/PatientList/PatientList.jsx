import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
	IconGenderMale,
	IconGenderFemale,
	IconSearch,
	IconPlus,
	IconChevronLeft,
	IconChevronRight,
} from "@tabler/icons-react";
const PatientDetails = React.lazy(() =>
	import("../PatientDetails/PatientDetails")
);

const PatientList = ({ initialPatients, user }) => {
	const [patients, setPatients] = useState(initialPatients || []);
	const [loading, setLoading] = useState(!initialPatients);
	const [error, setError] = useState(null);
	const [selectedPatientId, setSelectedPatientId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchLetter, setSearchLetter] = useState("");

	const calculateAge = useMemo(
		() => (birthDate) => {
			if (!birthDate) return "N/A";
			const dateOfBirth = new Date(birthDate);
			if (isNaN(dateOfBirth.getTime())) return "N/A";
			const today = new Date();
			let age = today.getFullYear() - dateOfBirth.getFullYear();
			const monthDifference = today.getMonth() - dateOfBirth.getMonth();
			if (
				monthDifference < 0 ||
				(monthDifference === 0 &&
					today.getDate() < dateOfBirth.getDate())
			) {
				age--;
			}
			return age;
		},
		[]
	);

	// État de pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [patientsPerPage] = useState(15);

	// Fonction pour charger les patients
	const fetchPatients = useCallback(async () => {
		try {
			const response = await fetch("/api/patients");
			if (!response.ok) {
				throw new Error("Erreur dans le chargement des données.");
			}
			const patientsData = await response.json();
			// Trier les patients par nom
			patientsData.sort((a, b) => a.name.localeCompare(b.name));
			setPatients(patientsData);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	// Chargement des patients si non fournis initialement
	useEffect(() => {
		if (!initialPatients) {
			fetchPatients();
		} else {
			initialPatients.sort((a, b) => a.name.localeCompare(b.name));
			setPatients(initialPatients);
		}
	}, [initialPatients, fetchPatients]);

	// Filtrage des patients
	const filteredPatients = useMemo(() => {
		return patients.filter((patient) => {
			const matchesSearch = patient.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesLetter = searchLetter
				? patient.name
						.toLowerCase()
						.startsWith(searchLetter.toLowerCase())
				: true;
			return matchesSearch && matchesLetter;
		});
	}, [patients, searchTerm, searchLetter]);

	// Logique de pagination
	const totalPages = useMemo(
		() => Math.ceil(filteredPatients.length / patientsPerPage),
		[filteredPatients, patientsPerPage]
	);
	const handlePageChange = (newPage) => {
		if (newPage > 0 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};
	const indexOfLastPatient = currentPage * patientsPerPage;
	const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
	const currentPatients = useMemo(() => {
		return filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
	}, [filteredPatients, indexOfFirstPatient, indexOfLastPatient]);

	if (loading) {
		return (
			<div className="text-lg text-gray-500 mt-20 text-center">
				<p>Chargement des patients...</p>
				<div className="spinner" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-lg text-red-500 text-center">
				<p>Erreur: {error}</p>
				<button
					onClick={fetchPatients}
					className="text-blue-500 underline"
				>
					Réessayer
				</button>
			</div>
		);
	}

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	return (
		<div className="flex-1 p-4 sm:p-6 md:p-10 bg-white dark:bg-gray-900 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 mt-10 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6 flex items-center justify-between">
				{/* Texte de bienvenue */}
				<div className="flex flex-col max-w-[75%]">
					<h1 className="text-2xl sm:text-3xl font-bold mb-2">
						Bienvenue,{" "}
						{user
							? user.user_metadata?.user_metadata?.first_name ||
							  user.email
							: "Utilisateur"}
					</h1>
					<p className="text-base sm:text-lg">
						{" "}
						Voici un aperçu de vos patients
					</p>
				</div>

				{/* Logo à droite */}
				<div className="flex-shrink-0 ml-4 relative">
					<Image
						src="/assets/icons/logo-full.svg"
						alt="Logo"
						width={200}
						height={200}
						className="object-contain rounded-xl w-[100px] sm:w-[180px] md:w-[200px] lg:w-[210px] xl:w-[200px] md:ml-4"
					/>
				</div>
			</div>

			<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
				Recherche de patients
			</h2>

			{/* Barre de recherche */}
			<div className="relative max-w-sm mx-auto">
				<input
					type="text"
					placeholder="Rechercher par nom..."
					className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-900dark:text-white"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<IconSearch
					className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
					size={20}
				/>
			</div>

			{/* Navigation alphabétique */}
			<div className="hidden md:flex flex-wrap justify-center gap-1 mb-4">
				{alphabet.map((letter) => (
					<button
						key={letter}
						className={`w-7 h-7 rounded-full transition duration-300 text-sm ${
							searchLetter === letter
								? "bg-blue-500 text-white"
								: "hover:bg-blue-100 dark:hover:bg-gray-700"
						}`}
						onClick={() => setSearchLetter(letter)}
					>
						{letter}
					</button>
				))}
				<button
					className={`px-2 py-1 rounded-full transition duration-300 text-sm ${
						searchLetter === ""
							? "bg-blue-500 text-white"
							: "hover:bg-blue-100 dark:hover:bg-gray-700"
					}`}
					onClick={() => {
						setSearchLetter("");
						setSearchTerm("");
					}}
				>
					Tous
				</button>
			</div>

			{/* Select pour la navigation alphabétique sur mobile */}
			<select
				className="md:hidden mb-4 p-2 border border-blue-500 rounded-lg w-full max-w-sm shadow-md mx-auto text-sm"
				value={searchLetter}
				onChange={(e) => setSearchLetter(e.target.value)}
			>
				<option value="">Tous</option>
				{alphabet.map((letter) => (
					<option key={letter} value={letter}>
						{letter}
					</option>
				))}
			</select>

			{/* Liste des patients */}
			<ul className="space-y-3 w-full max-w-4xl mx-auto">
				{currentPatients.length === 0 ? (
					<li className="text-base sm:text-lg text-gray-500 text-center">
						Aucun patient trouvé.
					</li>
				) : (
					currentPatients.map((patient) => (
						<li
							key={patient.id}
							className="p-3 sm:p-4 border border-blue-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col dark:bg-gray-800"
						>
							<div
								className="flex flex-col sm:flex-row sm:items-center cursor-pointer justify-between"
								onClick={() =>
									setSelectedPatientId((prevId) =>
										prevId === patient.id
											? null
											: patient.id
									)
								}
							>
								<div className="flex items-center mb-2 sm:mb-0">
									{patient.gender === "Homme" ? (
										<IconGenderMale
											className="text-blue-500 mr-2"
											size={18}
										/>
									) : (
										<IconGenderFemale
											className="text-pink-500 mr-2"
											size={18}
										/>
									)}
									<h2 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-300">
										{patient.name}
									</h2>
								</div>
								<div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-semibold">
									<p>
										Âge: {calculateAge(patient.birthDate)}{" "}
										ans
									</p>
									<p>
										Tél:{" "}
										<a
											href={`tel:${patient.phone}`}
											className="text-stone-900 hover:underline dark:text-green-400"
										>
											{patient.phone}
										</a>
									</p>
								</div>
							</div>
							{selectedPatientId === patient.id && (
								<React.Suspense
									fallback={
										<div>Chargement des détails...</div>
									}
								>
									<PatientDetails
										patient={patient}
										onClose={() =>
											setSelectedPatientId(null)
										}
									/>
								</React.Suspense>
							)}
						</li>
					))
				)}
			</ul>

			{/* Actions rapides */}
			<div className="mt-6">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
					Actions rapides
				</h2>
				<div className="flex justify-center">
					<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 flex items-center text-sm sm:text-base">
						<IconPlus className="mr-2" size={18} />
						Ajouter un patient
					</button>
				</div>
			</div>

			{/* Contrôles de pagination */}
			<div className="flex flex-col sm:flex-row justify-between items-center mt-4 w-full max-w-3xl mx-auto">
				<select
					value={currentPage}
					onChange={(e) => handlePageChange(Number(e.target.value))}
					className="mb-4 sm:mb-0 p-2 border border-blue-500 rounded-lg shadow-md text-sm"
				>
					{Array.from({ length: totalPages }, (_, index) => (
						<option key={index} value={index + 1}>
							Page {index + 1}
						</option>
					))}
				</select>
				<div className="flex justify-center space-x-2 sm:space-x-4">
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="px-4 py-2 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold rounded-full shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
					>
						<IconChevronLeft className="mr-1" size={18} /> Précédent
					</button>
					<button
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
					>
						Suivant <IconChevronRight className="ml-1" size={18} />
					</button>
				</div>
			</div>
		</div>
	);
};

PatientList.displayName = "PatientList";

export default React.memo(PatientList);
