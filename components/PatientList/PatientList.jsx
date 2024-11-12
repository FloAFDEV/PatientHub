import React, {
	useEffect,
	useState,
	useMemo,
	useCallback,
	Suspense,
} from "react";
import Image from "next/image";
import AddPatientForm from "@/components/addPatientForm/addPatientForm";
import {
	IconGenderMale,
	IconGenderFemale,
	IconSearch,
	IconPlus,
	IconChevronLeft,
	IconChevronRight,
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
			<div className="flex items-center justify-center min-h-screen bg-slate-800">
				<div className="animate-spin h-16 w-16 border-t-4 border-blue-500 rounded-full mb-6"></div>
				<p className="text-xl text-gray-300 mt-6">
					Chargement en cours...
				</p>
			</div>
		);
	}

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	return (
		<div className="flex-1 p-4 sm:p-6 md:p-10 bg-gray-100 dark:bg-gray-900 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar={false}
				toastClassName="bg-blue-600 text-white font-semibold text-lg p-3 rounded-lg"
				bodyClassName="text-md p-2"
			/>

			<div
				className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
 text-white p-3 sm:p-4 rounded-lg shadow-lg mb-4 flex items-center justify-between"
			>
				<div className="flex flex-col flex-grow pr-2">
					<h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
						Bienvenue,{" "}
						{user
							? user.user_metadata?.user_metadata?.first_name ||
							  user.email
							: "Utilisateur"}
					</h1>
					<p className="text-sm sm:text-base">
						Voici un aperçu de vos patients
					</p>
				</div>
				<div className="flex-shrink-0 ml-2 sm:ml-4">
					<Image
						src="/assets/icons/logo-full.svg"
						alt="Logo"
						width={100}
						height={100}
						className="object-contain rounded-xl w-[60px] sm:w-[80px] md:w-[100px]"
						priority
					/>
				</div>
			</div>
			<button
				onClick={() => toast.success("Toast de test réussi !")}
				className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
			>
				Montrer le toast
			</button>
			<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
				Recherche de patients
			</h2>

			<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
				<div className="relative max-w-sm w-full">
					<input
						type="text"
						placeholder="Rechercher par nom..."
						className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<IconSearch
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						size={20}
					/>
				</div>
				<div>
					<button
						onClick={() => setShowAddFormPatient(true)}
						className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 flex items-center text-sm sm:text-base"
					>
						<IconPlus className="mr-2" size={18} />
						Ajouter un patient
					</button>
				</div>
			</div>

			{showAddFormPatient && (
				<Suspense fallback={<div>Loading...</div>}>
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
				</Suspense>
			)}

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

			<ul className="space-y-3 w-full max-w-5xl mx-auto">
				{filteredPatients.length === 0 ? (
					<li className="text-base sm:text-lg text-gray-500 text-center">
						Aucun patient trouvé.
					</li>
				) : (
					filteredPatients.map((patient) => (
						<li
							key={patient.id}
							className={`p-3 sm:p-4 border rounded-lg shadow-md bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200 flex flex-col ${
								patient.gender === "Homme"
									? "text-blue-800"
									: "text-pink-800"
							} dark:bg-gray-800`}
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
								<div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-semibold flex space-x-6">
									<p>
										Âge: {calculateAge(patient.birthDate)}{" "}
										ans
									</p>
									<p>
										Tél:{" "}
										{patient.phone ? (
											<a
												href={`tel:${patient.phone}`}
												className="text-stone-900 hover:underline dark:text-green-400"
											>
												{patient.phone}
											</a>
										) : (
											<span className="text-stone-900 dark:text-gray-400">
												Numéro non renseigné
											</span>
										)}
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
				<div className="flex justify-center items-center space-x-2 sm:space-x-4">
					<button
						onClick={handlePrevPage}
						disabled={currentPage === 1}
						className={`px-4 py-2 ${
							currentPage === 1
								? "opacity-50 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700 text-white"
						} rounded-lg transition`}
					>
						<IconChevronLeft size={18} />
					</button>
					<button
						onClick={handleNextPage}
						disabled={currentPage >= totalPages}
						className={`px-4 py-2 ${
							currentPage >= totalPages
								? "opacity-50 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700 text-white"
						} rounded-lg transition`}
					>
						<IconChevronRight size={18} />
					</button>
				</div>
			</div>
		</div>
	);
};

PatientList.displayName = "PatientList";
export default React.memo(PatientList);
