import React, { useEffect, useState, useMemo } from "react";
import { IconGenderMale, IconGenderFemale } from "@tabler/icons-react";
import PatientDetails from "../PatientDetails/PatientDetails";

const PatientList = ({ initialPatients, user }) => {
	const [patients, setPatients] = useState(initialPatients || []);
	const [loading, setLoading] = useState(!initialPatients);
	const [error, setError] = useState(null);
	const [selectedPatientId, setSelectedPatientId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchLetter, setSearchLetter] = useState("");

	// État de pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [patientsPerPage] = useState(15);

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
			initialPatients.sort((a, b) => a.name.localeCompare(b.name));
			setPatients(initialPatients);
		}
	}, [initialPatients]);

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
	const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
	const indexOfLastPatient = currentPage * patientsPerPage;
	const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
	const currentPatients = useMemo(() => {
		return filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
	}, [filteredPatients, indexOfFirstPatient, indexOfLastPatient]);

	if (loading) {
		return (
			<div className="text-lg text-gray-500 mt-20 text-center">
				Chargement des patients...
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-lg text-red-500 text-center">
				Erreur: {error}
			</div>
		);
	}

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	return (
		<div className="flex-1 p-4 sm:p-6 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 mt-10 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6 max-w-full">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">
					Bienvenue,{" "}
					{user
						? user.user_metadata?.user_metadata?.first_name ||
						  user.email
						: "Utilisateur"}
				</h1>
				<p className="text-base sm:text-lg">
					Voici un aperçu de vos patients
				</p>
			</div>

			<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
				Recherche de patients
			</h2>

			{/* Barre de recherche */}
			<input
				type="text"
				placeholder="Rechercher par nom..."
				className="mb-6 p-2 border border-blue-500 rounded-lg  max-w-sm shadow-md mx-auto"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			{/* Navigation alphabétique */}
			<div className="hidden md:flex flex-wrap justify-center space-x-2 mb-4">
				{alphabet.map((letter) => (
					<button
						key={letter}
						className={`w-8 h-8 px-2 py-1 rounded-full transition duration-300 transform hover:scale-110 ${
							searchLetter === letter
								? "bg-blue-500 text-white scale-110 ring-2 ring-blue-300"
								: "hover:bg-blue-100"
						}`}
						onClick={() => setSearchLetter(letter)}
					>
						{letter}
					</button>
				))}
				<button
					className={`px-2 py-1 rounded-full transition duration-300 transform ${
						searchLetter === ""
							? "bg-blue-500 text-white scale-110 ring-2 ring-blue-300"
							: "hover:bg-blue-100 hover:scale-110"
					}`}
					onClick={() => setSearchLetter("")}
				>
					Tous
				</button>
			</div>

			{/* Select pour la navigation alphabétique sur mobile */}
			<select
				className="md:hidden mb-4 p-2 border border-blue-500 rounded-lg w-full max-w-sm shadow-md mx-auto"
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
			<ul className="space-y-4 w-full max-w-4xl mx-auto">
				{currentPatients.length === 0 ? (
					<li className="text-lg text-gray-500 text-center">
						Aucun patient trouvé.
					</li>
				) : (
					currentPatients.map((patient) => (
						<li
							key={patient.id}
							className="p-4 border border-blue-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col bg-white"
						>
							<div
								className="flex items-center cursor-pointer justify-between"
								onClick={() =>
									setSelectedPatientId((prevId) =>
										prevId === patient.id
											? null
											: patient.id
									)
								}
							>
								<div className="flex items-center">
									{patient.gender === "Homme" ? (
										<IconGenderMale className="text-blue-500 mr-2" />
									) : (
										<IconGenderFemale className="text-pink-500 mr-2" />
									)}
									<h2 className="font-semibold text-lg text-gray-800">
										{patient.name}
									</h2>
								</div>
								<div className="text-gray-600 text-sm ml-4">
									<p>Téléphone: {patient.phone}</p>
								</div>
							</div>
							{selectedPatientId === patient.id && (
								<PatientDetails
									patient={patient}
									onClose={() => setSelectedPatientId(null)}
								/>
							)}
						</li>
					))
				)}
			</ul>

			{/* Actions rapides */}
			<div className="mt-6 sm:mt-8">
				<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
					Actions rapides
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					<button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm sm:text-base">
						Ajouter un patient
					</button>
				</div>
			</div>

			{/* Contrôles de pagination */}
			<div className="flex flex-col md:flex-row justify-between items-center mt-4 w-full max-w-3xl mx-auto">
				<select
					value={currentPage}
					onChange={(e) => setCurrentPage(Number(e.target.value))}
					className="mb-4 md:mb-0 p-2 border border-blue-500 rounded-lg max-w-[60px] shadow-md"
				>
					{Array.from({ length: totalPages }, (_, index) => (
						<option key={index} value={index + 1}>
							Page {index + 1}
						</option>
					))}
				</select>

				<div className="flex">
					<button
						onClick={() =>
							setCurrentPage((prev) => Math.max(prev - 1, 1))
						}
						disabled={currentPage === 1}
						className="p-2 border border-blue-500 rounded-lg mr-2 transition duration-300 hover:bg-blue-100 disabled:opacity-50"
					>
						Précédent
					</button>
					<button
						onClick={() =>
							setCurrentPage((prev) =>
								Math.min(prev + 1, totalPages)
							)
						}
						disabled={currentPage === totalPages}
						className="p-2 border border-blue-500 rounded-lg transition duration-300 hover:bg-blue-100 disabled:opacity-50"
					>
						Suivant
					</button>
				</div>
			</div>
		</div>
	);
};

export default React.memo(PatientList);
