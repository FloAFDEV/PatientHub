import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
	IconGenderMale,
	IconGenderFemale,
	IconSearch,
	IconPlus,
	IconChevronLeft,
	IconChevronRight,
} from "@tabler/icons-react";
import PatientDetails from "../PatientDetails/PatientDetails";

const PatientList = ({ initialPatients, user }) => {
	const [patients, setPatients] = useState(initialPatients || []);
	const [loading, setLoading] = useState(!initialPatients);
	const [error, setError] = useState(null);
	const [selectedPatientId, setSelectedPatientId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchLetter, setSearchLetter] = useState("");

	const calculateAge = useCallback((birthDate) => {
		if (!birthDate) return "N/A";
		const dateOfBirth = new Date(birthDate);
		if (isNaN(dateOfBirth.getTime())) return "N/A";
		const today = new Date();
		let age = today.getFullYear() - dateOfBirth.getFullYear();
		const monthDifference = today.getMonth() - dateOfBirth.getMonth();
		if (
			monthDifference < 0 ||
			(monthDifference === 0 && today.getDate() < dateOfBirth.getDate())
		) {
			age--;
		}
		return age;
	}, []);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const patientsPerPage = 15;

	// Memoized alphabet for rendering
	const alphabet = useMemo(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), []);

	// Fetch patients once if `initialPatients` is not provided
	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const response = await fetch("/api/patients");
				if (!response.ok) {
					throw new Error("Erreur dans le chargement des données.");
				}
				const patientsData = await response.json();
				patientsData.sort((a, b) => a.name.localeCompare(b.name));
				setPatients(patientsData);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		if (!initialPatients) {
			fetchPatients();
		} else {
			const sortedPatients = [...initialPatients].sort((a, b) =>
				a.name.localeCompare(b.name)
			);
			setPatients(sortedPatients);
		}
	}, [initialPatients]);

	// Filtered and paginated patients
	const filteredPatients = useMemo(() => {
		const term = searchTerm.toLowerCase();
		return patients.filter((patient) => {
			const matchesSearch = patient.name.toLowerCase().includes(term);
			const matchesLetter = searchLetter
				? patient.name
						.toLowerCase()
						.startsWith(searchLetter.toLowerCase())
				: true;
			return matchesSearch && matchesLetter;
		});
	}, [patients, searchTerm, searchLetter]);

	// Pagination logic with memoized pages
	const totalPages = useMemo(
		() => Math.ceil(filteredPatients.length / patientsPerPage),
		[filteredPatients, patientsPerPage]
	);

	const currentPatients = useMemo(() => {
		const startIndex = (currentPage - 1) * patientsPerPage;
		return filteredPatients.slice(startIndex, startIndex + patientsPerPage);
	}, [filteredPatients, currentPage, patientsPerPage]);

	const handlePageChange = useCallback(
		(newPage) => {
			if (newPage > 0 && newPage <= totalPages) {
				setCurrentPage(newPage);
			}
		},
		[totalPages]
	);

	// Handle search and alphabet navigation
	const handleSearchChange = (e) => setSearchTerm(e.target.value);
	const handleLetterSelect = (letter) => {
		setSearchLetter(letter);
		setSearchTerm("");
	};

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
					onClick={() => window.location.reload()}
					className="text-blue-500 underline"
				>
					Réessayer
				</button>
			</div>
		);
	}

	return (
		<div className="flex-1 p-4 bg-white dark:bg-gray-800 flex flex-col gap-4 overflow-y-auto h-screen">
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg mb-4">
				<h1 className="text-xl sm:text-2xl font-bold mb-2">
					Bienvenue,{" "}
					{user?.user_metadata?.user_metadata?.first_name ||
						user?.email ||
						"Utilisateur"}
				</h1>
				<p className="text-sm sm:text-base">
					Voici un aperçu de vos patients
				</p>
			</div>

			{/* Search Bar */}
			<div className="relative max-w-sm mx-auto">
				<input
					type="text"
					placeholder="Rechercher par nom..."
					className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
					value={searchTerm}
					onChange={handleSearchChange}
				/>
				<IconSearch
					className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
					size={20}
				/>
			</div>

			{/* Alphabet navigation */}
			<div className="hidden md:flex flex-wrap justify-center gap-1 mb-4">
				{alphabet.map((letter) => (
					<button
						key={letter}
						className={`w-7 h-7 rounded-full transition duration-300 text-sm ${
							searchLetter === letter
								? "bg-blue-500 text-white"
								: "hover:bg-blue-100 dark:hover:bg-gray-700"
						}`}
						onClick={() => handleLetterSelect(letter)}
					>
						{letter}
					</button>
				))}
				<button
					className={`px-2 py-1 rounded-full transition duration-300 text-sm ${
						!searchLetter
							? "bg-blue-500 text-white"
							: "hover:bg-blue-100 dark:hover:bg-gray-700"
					}`}
					onClick={() => handleLetterSelect("")}
				>
					Tous
				</button>
			</div>

			{/* Patient list */}
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
							onClick={() =>
								setSelectedPatientId((prevId) =>
									prevId === patient.id ? null : patient.id
								)
							}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center">
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

			{/* Pagination controls */}
			<div className="flex justify-center space-x-2 sm:space-x-4 mt-4">
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="p-2 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
				>
					<IconChevronLeft />
				</button>
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="p-2 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
				>
					<IconChevronRight />
				</button>
			</div>
		</div>
	);
};

export default PatientList;
