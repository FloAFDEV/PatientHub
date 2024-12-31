"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePatients } from "@/hooks/usePatients";
import { useDebounce } from "@/hooks/useDebounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
	IconGenderMale,
	IconGenderFemale,
	IconSearch,
	IconPlus,
	IconChevronLeft,
	IconChevronRight,
	IconSkull,
	IconCalendar,
	IconFilter,
	IconRefresh,
	IconPhone,
	IconMail,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppointmentDialog } from "@/components/Appointments/AppointmentDialog";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const PatientDetails = React.lazy(() =>
	import("@/components/PatientDetails/PatientDetails")
);

const PatientList = ({ onAddPatientClick }) => {
	const [selectedPatientId, setSelectedPatientId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchLetter, setSearchLetter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
	const [selectedPatientForAppointment, setSelectedPatientForAppointment] =
		useState(null);
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	const { patients, totalPages, isLoading, isError, mutate } = usePatients(
		currentPage,
		debouncedSearchTerm,
		searchLetter
	);

	const handlePatientDeleted = async (patientId) => {
		try {
			await deletePatient(patientId);
			toast.success("Le patient a été supprimé avec succès !");
			mutate();
		} catch (error) {
			console.error("Erreur de suppression:", error);
			toast.error(`Une erreur est survenue: ${error.message}`);
		}
	};

	const handleAddAppointment = (patient) => {
		setSelectedPatientForAppointment(patient);
		setShowAppointmentDialog(true);
	};

	const calculateAge = (birthDate) => {
		if (!birthDate || isNaN(new Date(birthDate).getTime())) return "N/A";
		const today = new Date();
		const birth = new Date(birthDate);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birth.getDate())
		) {
			age--;
		}
		return age;
	};

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	const handleLetterClick = (letter) => {
		setSearchLetter(letter === searchLetter ? "" : letter);
		setCurrentPage(1);
		setIsFilterOpen(false);
	};

	const handleResetFilters = () => {
		setSearchTerm("");
		setSearchLetter("");
		setCurrentPage(1);
		setIsFilterOpen(false);
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100 dark:bg-gray-900">
				<div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-primary rounded-full"></div>
				<p className="mt-4 text-gray-600 dark:text-gray-400">
					Chargement...
				</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
				<p className="text-red-500">
					Une erreur est survenue lors du chargement des patients
				</p>
				<Button
					onClick={() => mutate()}
					variant="outline"
					className="flex items-center gap-2"
				>
					<IconRefresh className="h-4 w-4" />
					Réessayer
				</Button>
			</div>
		);
	}

	const filteredPatients = (patients || []).filter((patient) => {
		const firstName = patient.firstName || "";
		const lastName = patient.lastName || "";

		// Vérification de la correspondance par lettre (nom ou prénom commence par la lettre sélectionnée)
		const isMatchingByLetter = searchLetter
			? firstName.toUpperCase().startsWith(searchLetter.toUpperCase()) ||
			  lastName.toUpperCase().startsWith(searchLetter.toUpperCase())
			: true;

		// Vérification de la correspondance par terme (nom complet contient le terme de recherche)
		const isMatchingByTerm = searchTerm
			? `${firstName} ${lastName}`
					.toUpperCase()
					.includes(searchTerm.toUpperCase())
			: true;

		// Le patient est retenu si au moins un des deux critères correspond
		const isMatching = isMatchingByLetter || isMatchingByTerm;

		return isMatching;
	});

	// Ensuite, trie les patients filtrés par prénom et nom de famille
	const sortedPatients = filteredPatients.sort((a, b) => {
		const nameA = `${a.firstName || ""} ${a.lastName || ""}`;
		const nameB = `${b.firstName || ""} ${b.lastName || ""}`;
		// Utilise localeCompare pour gérer les accents et la casse
		return nameA.localeCompare(nameB, "fr", { sensitivity: "base" });
	});

	return (
		<div className="flex-1 p-2 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
			<ToastContainer />
			<header className="mb-8">
				<div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden rounded-lg shadow-xl mb-8">
					<Image
						src="/assets/images/PatientRoom.webp"
						alt="Fauteuil de cabinet designe et moderne"
						fill
						style={{
							objectFit: "cover",
						}}
						className="opacity-80 object-[center_50%] sm:object-[center_50%] sm:object-cover"
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
						<h1 className="mt-2 text-3xl font-bold drop-shadow-sm">
							Liste de vos patients
						</h1>
						<p className="hidden sm:block text-base sm:text-lg md:text-xl drop-shadow-sm max-w-2xl">
							Consultez et gérez la liste de vos patients en toute
							simplicité
						</p>
					</div>
				</div>
			</header>
			{/* Barre de recherche et actions */}
			<div className="flex flex-col gap-3 sm:gap-4 mb-6">
				<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
					<div className="relative flex-1">
						<IconSearch
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							size={20}
						/>
						<Input
							type="text"
							placeholder="Rechercher un patient..."
							value={searchTerm}
							onChange={handleSearchChange}
							className="pl-10 h-11 w-full"
						/>
					</div>
					<div className="flex gap-2">
						<Sheet
							open={isFilterOpen}
							onOpenChange={setIsFilterOpen}
						>
							<SheetTrigger asChild>
								<Button
									variant="outline"
									className="md:hidden flex-1 sm:flex-none"
								>
									<IconFilter className="h-4 w-4 sm:mr-2" />
									<span className="hidden sm:inline">
										Filtres
									</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="bottom" className="h-[80vh]">
								<SheetHeader>
									<SheetTitle>Filtrer par lettre</SheetTitle>
								</SheetHeader>
								<div className="grid grid-cols-5 gap-4 p-4 mt-8">
									{alphabet.map((letter) => (
										<Button
											key={letter}
											variant={
												searchLetter === letter
													? "default"
													: "outline"
											}
											className="w-full"
											onClick={() =>
												handleLetterClick(letter)
											}
										>
											{letter}
										</Button>
									))}
									<Button
										variant={
											!searchLetter && !searchTerm
												? "default"
												: "outline"
										}
										className="w-full col-span-5 border-2 border-neutral-900 dark:border-white"
										onClick={handleResetFilters}
									>
										Réinitialiser
									</Button>
								</div>
							</SheetContent>
						</Sheet>

						<Button
							aria-label="Ajouter un nouveau patient"
							onClick={onAddPatientClick}
							className="flex-1 sm:flex-none h-9 dark:border-gray-400 dark:border-b-2 hover:bg-blue-400"
						>
							<IconPlus size={18} className="sm:mr-2 " />
							<span className="hidden sm:inline">
								Ajouter un patient
							</span>
						</Button>
					</div>
				</div>

				{/* Filtre alphabétique desktop */}
				<div className="hidden md:flex flex-wrap justify-center gap-1.5">
					{alphabet.map((letter) => (
						<Button
							aria-label={`Filtrer par lettre ${letter}`}
							key={letter}
							variant={
								searchLetter === letter ? "default" : "outline"
							}
							className="w-8 h-8 p-0 text-sm"
							onClick={() => handleLetterClick(letter)}
						>
							{letter}
						</Button>
					))}
					<Button
						variant={
							!searchLetter && !searchTerm ? "default" : "outline"
						}
						className="px-3 text-sm"
						onClick={handleResetFilters}
					>
						Tous
					</Button>
				</div>
			</div>

			{/* Liste des patients */}
			<div className="space-y-2 sm:space-y-4">
				{!sortedPatients.length ? (
					<div className="text-center py-8 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
						<IconSearch className="mx-auto h-12 w-12 text-gray-400" />
						<p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
							Aucun patient trouvé
						</p>
						<p className="mt-2 text-sm text-gray-500">
							Modifiez vos critères de recherche ou ajoutez un
							nouveau patient
						</p>
					</div>
				) : (
					sortedPatients.map((patient) => (
						<div
							key={`${patient.id || ""}-${patient.firstName}-${
								patient.lastName
							}`}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
						>
							<div className="p-3 sm:p-2 ">
								<div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
									<div className="flex items-start sm:items-center gap-3 flex-1">
										<div className="mt-1 sm:mt-0">
											{patient.gender === "Homme" ? (
												<IconGenderMale
													className="text-blue-500"
													size={24}
												/>
											) : (
												<IconGenderFemale
													className="text-pink-500"
													size={24}
												/>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
												{`${
													patient.firstName ||
													"Inconnu"
												} ${patient.lastName || ""}`}
												{patient.isDeceased && (
													<span className="inline-flex items-center gap-1 text-sm text-red-500">
														<IconSkull size={16} />
														<span className="hidden sm:inline">
															Décédé(e)
														</span>
													</span>
												)}
											</h3>

											<div className="mt-1 flex flex-row gap-1 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:gap-4">
												<span>
													Âge:{" "}
													{calculateAge(
														patient.birthDate
													)}{" "}
													ans
												</span>
												{patient.phone && (
													<a
														href={`tel:${patient.phone}`}
														className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
													>
														<IconPhone size={14} />
														{patient.phone}
													</a>
												)}
												{patient.email && (
													<a
														href={`mailto:${patient.email}`}
														className="hidden sm:flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
													>
														<IconMail size={14} />
														{patient.email}
													</a>
												)}
											</div>
										</div>
									</div>
									<div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 mt-2 sm:mt-0">
										<Button
											aria-label={`Voir les détails du patient ${patient.firstName} ${patient.lastName}`}
											variant="ghost"
											size="sm"
											onClick={() =>
												setSelectedPatientId(
													selectedPatientId ===
														patient.id
														? null
														: patient.id
												)
											}
											className="hover:text-blue-500 dark:hover:text-amber-500"
										>
											{selectedPatientId === patient.id
												? "Fermer"
												: "Détails"}
										</Button>

										<Button
											aria-label={`Prendre un rendez-vous avec ${patient.firstName} ${patient.lastName}`}
											variant="outline"
											size="sm"
											onClick={() =>
												handleAddAppointment(patient)
											}
											className="flex-1 sm:flex-none h-9 dark:hover:text-gray-900 dark:hover:bg-amber-500"
										>
											<IconCalendar className="h-4 w-4 sm:mr-2" />
											<span className="hidden sm:inline ">
												Rendez-vous
											</span>
										</Button>
									</div>
								</div>
							</div>
							{selectedPatientId === patient.id && (
								<React.Suspense
									fallback={
										<div className="p-4 text-center">
											<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
										</div>
									}
								>
									<PatientDetails
										patient={patient}
										onClose={() =>
											setSelectedPatientId(null)
										}
										onPatientDeleted={handlePatientDeleted}
									/>
								</React.Suspense>
							)}
						</div>
					))
				)}
			</div>
			{/* Pagination adaptative */}
			{totalPages > 1 && (
				<div className="flex justify-between items-center mt-6">
					<Button
						aria-label="Page précédente"
						variant="outline"
						onClick={() =>
							setCurrentPage((p) => Math.max(1, p - 1))
						}
						disabled={currentPage === 1}
						className="h-9 px-2 sm:px-4"
					>
						<IconChevronLeft className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">Précédent</span>
					</Button>
					<span className="text-sm text-gray-600 dark:text-gray-400">
						{currentPage} / {totalPages}
					</span>
					<Button
						aria-label="Page suivante"
						variant="outline"
						onClick={() =>
							setCurrentPage((p) => Math.min(totalPages, p + 1))
						}
						disabled={currentPage === totalPages}
						className="h-9 px-2 sm:px-4"
					>
						<span className="hidden sm:inline">Suivant</span>
						<IconChevronRight className="h-4 w-4 sm:ml-2" />
					</Button>
				</div>
			)}
			{/* Modales */}
			{showAppointmentDialog && selectedPatientForAppointment && (
				<AppointmentDialog
					open={showAppointmentDialog}
					onOpenChange={setShowAppointmentDialog}
					patients={[selectedPatientForAppointment]}
					selectedDate={new Date()}
					mode="create"
				/>
			)}
		</div>
	);
};

export default React.memo(PatientList);
