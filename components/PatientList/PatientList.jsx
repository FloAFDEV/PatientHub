"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePatients } from "@/hooks/usePatients";
import { useDebounce } from "@/hooks/useDebounce";
import { ToastContainer, toast } from "react-toastify";
import { AppointmentDialog } from "@/components/Appointments/AppointmentDialog";
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
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [selectedPatientForAppointment, setSelectedPatientForAppointment] =
		useState(null);
	const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);

	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	const { patients, totalPages, isLoading, isError, mutate } = usePatients(
		currentPage,
		debouncedSearchTerm,
		searchLetter
	);

	const handlePatientDeleted = async (patientId) => {
		try {
			await deletePatient(patientId);
			toast.success("Le patient a été supprimé avec succès !", {
				className: "custom-toast",
				position: "top-center",
			});
			mutate();
		} catch (error) {
			console.error("Erreur de suppression:", error);
			toast.error(`Une erreur est survenue: ${error.message}`, {
				className: "custom-toast",
				position: "top-center",
			});
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
				<div className="flex justify-center items-center h-screen">
					<div className="w-full h-full flex justify-center items-center">
						<div className="absolute animate-ping h-[16rem] w-[16rem] rounded-full  border-t-4 border-b-4 border-red-500 "></div>
						<div className="absolute animate-spin h-[14rem] w-[14rem] rounded-full  border-t-4 border-b-4 border-purple-500 "></div>
						<div className="absolute animate-ping h-[12rem] w-[12rem] rounded-full  border-t-4 border-b-4 border-pink-500 "></div>
						<div className="absolute animate-spin h-[10rem] w-[10rem] rounded-full border-t-4 border-b-4 border-yellow-500"></div>
						<div className="absolute animate-ping h-[8rem] w-[8rem] rounded-full border-t-4 border-b-4 border-green-500"></div>
						<div className="absolute animate-spin h-[6rem] w-[6rem] rounded-full border-t-4 border-b-4 border-blue-500"></div>
						<div className="rounded-full h-28 w-28 animate-bounce flex items-center justify-center text-gray-500 font-semibold text-3xl dark:text-gray-100">
							Chargement...
						</div>
					</div>
				</div>
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
			{/* Header */}
			<header className="relative mb-8 group">
				<div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.01]">
					<Image
						src="/assets/images/PatientRoom.webp"
						alt="Cabinet médical moderne"
						fill
						style={{ objectFit: "cover" }}
						className="transform transition-transform duration-500 group-hover:scale-105"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 backdrop-blur-sm">
						<div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
							<h1 className="text-3xl font-bold text-white tracking-tight">
								Liste de vos patients
							</h1>
							<p className="mt-2 text-lg text-gray-200 max-w-2xl">
								Consultez et gérez la liste de vos patients en
								toute simplicité
							</p>
						</div>
					</div>
				</div>
			</header>
			{/* Barre de recherche et actions */}
			<div className="flex flex-col gap-3 sm:gap-4 mb-6">
				<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
					<div className="relative flex-1">
						<IconSearch
							className="absolute left-3 top-1/3 transform -translate-y-1/2 text-gray-400"
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

						{/* Actions rapides */}
						<div className="flex gap-2 mb-6">
							<Button
								onClick={onAddPatientClick}
								className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 hover:scale-105"
							>
								<IconPlus size={18} className="mr-2" />
								Nouveau patient
							</Button>
						</div>
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
			<div className="space-y-3">
				{!sortedPatients.length ? (
					<div className="text-center py-8 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-fadeIn">
						<IconSearch className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
						<p className="mt-4 text-lg font-medium">
							Aucun patient trouvé
						</p>
						<p className="mt-2 text-sm text-gray-500">
							Modifiez vos critères de recherche ou ajoutez un
							nouveau patient
						</p>
					</div>
				) : (
					sortedPatients.map((patient, index) => (
						<div
							key={patient.id}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
							style={{
								animationDelay: `${index * 50}ms`,
								opacity: 0,
								animation: "fadeSlideIn 0.5s ease forwards",
							}}
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
										</Button>{" "}
										{showAppointmentDialog && (
											<AppointmentDialog
												open={showAppointmentDialog}
												onOpenChange={
													setShowAppointmentDialog
												}
												selectedPatient={
													selectedPatientForAppointment
												}
												selectedDate={new Date()}
												patients={[]}
											/>
										)}
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
				<div className="flex justify-center gap-2 mt-6">
					<Button
						variant="outline"
						onClick={() =>
							setCurrentPage((p) => Math.max(1, p - 1))
						}
						disabled={currentPage === 1}
						className="transition-transform hover:scale-105"
					>
						<IconChevronLeft className="h-4 w-4" />
					</Button>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(
						(page) => (
							<Button
								key={page}
								variant={
									currentPage === page ? "default" : "outline"
								}
								onClick={() => setCurrentPage(page)}
								className="w-8 h-8 transition-transform hover:scale-110"
							>
								{page}
							</Button>
						)
					)}
					<Button
						variant="outline"
						onClick={() =>
							setCurrentPage((p) => Math.min(totalPages, p + 1))
						}
						disabled={currentPage === totalPages}
						className="transition-transform hover:scale-105"
					>
						<IconChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}

			<style jsx global>{`
				@keyframes fadeSlideIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.5s ease-in-out;
				}
			`}</style>
		</div>
	);
};

export default React.memo(PatientList);
