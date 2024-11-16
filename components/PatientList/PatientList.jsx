import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import AddPatientForm from "@/components/addPatientForm/addPatientForm";
import {
	IconGenderMale,
	IconGenderFemale,
	IconSearch,
	IconPlus,
	IconChevronLeft,
	IconChevronRight,
	IconSkull,
} from "@tabler/icons-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PatientDetails = React.lazy(() =>
	import("@/components/PatientDetails/PatientDetails")
);

const PatientList = ({ initialPatients, user }) => {
	const [patients, setPatients] = useState(initialPatients || []);
	const [loading, setLoading] = useState(!initialPatients);
	const [selectedPatientId, setSelectedPatientId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchLetter, setSearchLetter] = useState("");
	const [showAddFormPatient, setShowAddFormPatient] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

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

	const fetchPatients = useCallback(async (page) => {
		setLoading(true);
		try {
			const response = await fetch(`/api/patients?page=${page}`);
			if (!response.ok)
				throw new Error("Erreur dans le chargement des données.");
			const data = await response.json();
			setPatients(data.patients);
			setTotalPages(data.totalPages);
			setLoading(false);
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des patients :",
				error
			);
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPatients(currentPage);
	}, [currentPage, fetchPatients]);

	const filteredPatients = useMemo(() => {
		return patients
			.filter((patient) => {
				const matchesSearch = patient.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
				const matchesLetter =
					searchLetter === "" ||
					patient.name.charAt(0).toLowerCase() ===
						searchLetter.toLowerCase();
				return matchesSearch && matchesLetter;
			})
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [patients, searchTerm, searchLetter]);

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(Number(newPage));
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-slate-800">
				<div className="animate-spin h-16 w-16 border-t-4 border-blue-500 rounded-full mb-6"></div>
				<p className="text-xl text-gray-800 dark:text-gray-300 mt-6">
					Chargement en cours...
				</p>
			</div>
		);
	}

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	return (
		<div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar={false}
			/>

			<header className="m-8">
				<div className="flex items-center justify-between mt-8">
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
						Liste des patients
					</h1>
					<Image
						src="/assets/icons/logo-full.svg"
						alt="Logo"
						width={80}
						height={80}
						className="object-contain shadow-xl rounded-xl"
						priority
					/>
				</div>
				<p className="mt-2 text-gray-600 dark:text-gray-400">
					Gérez vos patients,{" "}
					{user?.user_metadata?.user_metadata?.first_name ||
						user?.email ||
						"Utilisateur"}
				</p>
			</header>

			<div className="flex flex-col md:flex-row justify-between items-center mb-6">
				<div className="relative w-full md:w-1/3 mb-4 md:mb-0">
					<input
						type="text"
						placeholder="Rechercher un patient..."
						className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<IconSearch
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						size={20}
					/>
				</div>
				<button
					onClick={() => setShowAddFormPatient(true)}
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center"
				>
					<IconPlus className="mr-2" size={18} /> Ajouter un patient
				</button>
			</div>

			<div className="hidden md:flex flex-wrap justify-center gap-2 mb-6">
				{alphabet.map((letter) => (
					<button
						key={letter}
						className={`w-8 h-8 rounded-full transition duration-300 ${
							searchLetter === letter
								? "bg-blue-500 text-white"
								: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900"
						}`}
						onClick={() => setSearchLetter(letter)}
					>
						{letter}
					</button>
				))}
				<button
					className={`px-3 py-1 rounded-full transition duration-300 ${
						searchLetter === ""
							? "bg-blue-500 text-white"
							: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900"
					}`}
					onClick={() => {
						setSearchLetter("");
						setSearchTerm("");
					}}
				>
					Tous
				</button>
			</div>

			<ul className="space-y-4">
				{filteredPatients.length === 0 ? (
					<li className="text-center text-gray-500 dark:text-gray-400">
						Aucun patient trouvé.
					</li>
				) : (
					filteredPatients.map((patient) => (
						<li
							key={patient.id}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
						>
							<div
								className="p-0.5 sm:p-1 cursor-pointer"
								onClick={() =>
									setSelectedPatientId((prevId) =>
										prevId === patient.id
											? null
											: patient.id
									)
								}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										{patient.gender === "Homme" ? (
											<IconGenderMale
												className="text-blue-500 mr-2"
												size={24}
											/>
										) : (
											<IconGenderFemale
												className="text-pink-500 mr-2"
												size={24}
											/>
										)}
										<h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
											{patient.name}
											{patient.isDeceased && (
												<>
													<span className="ml-2 text-sm font-normal text-red-500 dark:text-red-400">
														Décédé(e)
													</span>
													<IconSkull className="ml-2 w-5 h-5 text-red-500 dark:text-red-400" />
												</>
											)}
										</h2>
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										<p>
											Âge:{" "}
											{calculateAge(patient.birthDate)}{" "}
											ans
										</p>
										<p>
											Tél:{" "}
											{patient.phone ? (
												<a
													href={`tel:${patient.phone}`}
													className="text-blue-600 dark:text-blue-400 hover:underline"
												>
													{patient.phone}
												</a>
											) : (
												<span>Non renseigné</span>
											)}
										</p>
									</div>
								</div>
							</div>
							{selectedPatientId === patient.id && (
								<React.Suspense
									fallback={
										<div className="p-4 text-center">
											Chargement des détails...
										</div>
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

			<div className="flex justify-between items-center mt-6">
				<select
					value={currentPage}
					onChange={(e) => handlePageChange(Number(e.target.value))}
					className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
				>
					{Array.from({ length: totalPages }, (_, index) => (
						<option key={index} value={index + 1}>
							Page {index + 1}
						</option>
					))}
				</select>
				<div className="flex space-x-2">
					<button
						onClick={handlePrevPage}
						disabled={currentPage === 1}
						className={`p-2 rounded-lg transition ${
							currentPage === 1
								? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700 text-white"
						}`}
					>
						<IconChevronLeft size={24} />
					</button>
					<button
						onClick={handleNextPage}
						disabled={currentPage >= totalPages}
						className={`p-2 rounded-lg transition ${
							currentPage >= totalPages
								? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700 text-white"
						}`}
					>
						<IconChevronRight size={24} />
					</button>
				</div>
			</div>

			{showAddFormPatient && (
				<React.Suspense
					fallback={
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							Chargement...
						</div>
					}
				>
					<AddPatientForm
						onClose={() => setShowAddFormPatient(false)}
						onAddPatient={(newPatient) => {
							setPatients([...patients, newPatient]);
							toast.success("Patient ajouté avec succès !");
							setTimeout(() => {
								setShowAddFormPatient(false);
							}, 2000);
						}}
					/>
				</React.Suspense>
			)}
		</div>
	);
};

PatientList.displayName = "PatientList";
export default React.memo(PatientList);
