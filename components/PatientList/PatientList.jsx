import React, { useState, useCallback } from "react";
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
	// ----------------------------------------------------------
	// States
	// ----------------------------------------------------------
	const [selectedPatientId, setSelectedPatientId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchLetter, setSearchLetter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [selectedPatientForAppointment, setSelectedPatientForAppointment] =
		useState(null);
	const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);

	// État local pour indiquer qu’on fait une action lourde (update/delete)
	const [isActionLoading, setIsActionLoading] = useState(false);

	// ----------------------------------------------------------
	// Hooks
	// ----------------------------------------------------------
	const debouncedSearchTerm = useDebounce(searchTerm, 300);
	const {
		patients,
		totalPages,
		isError,
		isLoading, // ← état de chargement de SWR
		mutate,
	} = usePatients(currentPage, debouncedSearchTerm, searchLetter);

	// ----------------------------------------------------------
	// Handlers
	// ----------------------------------------------------------
	const handlePatientUpdated = useCallback(async () => {
		// On évite de relancer si on est déjà en train de faire une action
		if (isActionLoading) return;
		setIsActionLoading(true);
		try {
			// Recharge les patients depuis l'API via SWR
			await mutate();
			toast.success("La liste des patients a été mise à jour !");
		} catch (error) {
			console.error(error);
			toast.error(`Erreur : ${error.message}`);
		} finally {
			setIsActionLoading(false);
		}
	}, [mutate, isActionLoading]);

	const handlePatientDeleted = useCallback(
		async (patientId) => {
			// Même logique : on évite double-clic
			if (isActionLoading) return;
			setIsActionLoading(true);
			try {
				const response = await fetch(`/api/patients?id=${patientId}`, {
					method: "DELETE",
				});
				if (!response.ok) {
					throw new Error("Erreur lors de la suppression du patient");
				}
				// Invalidation du cache : recharge la liste
				await mutate();
				toast.success("Le patient a été supprimé avec succès !", {
					className: "custom-toast",
					position: "top-center",
				});
			} catch (error) {
				console.error("Erreur de suppression:", error);
				toast.error(`Une erreur est survenue: ${error.message}`, {
					className: "custom-toast",
					position: "top-center",
				});
			} finally {
				setIsActionLoading(false);
			}
		},
		[mutate, isActionLoading]
	);

	const handleAddAppointment = useCallback((patient) => {
		setSelectedPatientForAppointment(patient);
		setShowAppointmentDialog(true);
	}, []);

	const calculateAge = (birthDate) => {
		if (!birthDate) return "N/A";
		const today = new Date();
		const birth = new Date(birthDate);
		return (
			today.getFullYear() -
			birth.getFullYear() -
			(today <
			new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
				? 1
				: 0)
		);
	};

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	const handleLetterClick = useCallback(
		(letter) => {
			setSearchLetter(letter === searchLetter ? "" : letter);
			setCurrentPage(1);
			setIsFilterOpen(false);
		},
		[searchLetter]
	);

	const handleResetFilters = useCallback(() => {
		setSearchTerm("");
		setSearchLetter("");
		setCurrentPage(1);
		setIsFilterOpen(false);
	}, []);

	const handleSearchChange = useCallback((e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	}, []);

	// ----------------------------------------------------------
	// Filtrage et tri local des patients (facultatif, si besoin)
	// ----------------------------------------------------------
	const sortedPatients = (patients || [])
		.filter((patient) => {
			const firstName = patient.firstName || "";
			const lastName = patient.lastName || "";

			const isMatchingByLetter = searchLetter
				? firstName
						.toUpperCase()
						.startsWith(searchLetter.toUpperCase()) ||
				  lastName.toUpperCase().startsWith(searchLetter.toUpperCase())
				: true;

			const isMatchingByTerm = searchTerm
				? `${firstName} ${lastName}`
						.toUpperCase()
						.includes(searchTerm.toUpperCase())
				: true;

			return isMatchingByLetter || isMatchingByTerm;
		})
		.sort((a, b) => {
			const nameA = `${a.firstName || ""} ${a.lastName || ""}`;
			const nameB = `${b.firstName || ""} ${b.lastName || ""}`;
			return nameA.localeCompare(nameB, "fr", { sensitivity: "base" });
		});

	// ----------------------------------------------------------
	// Affichage du loader initial (SWR) ou de l'erreur
	// ----------------------------------------------------------
	if (isLoading) {
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
						Chargement des patients...
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

	// ----------------------------------------------------------
	// Rendu principal
	// ----------------------------------------------------------
	return (
		<div className="flex-1 p-2 bg-gray-50 dark:bg-gray-900">
			<ToastContainer />

			{/* Afficher un loader "d’action" si besoin (update/delete) */}
			{isActionLoading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
				</div>
			)}

			{/* Header avec image de couverture */}
			<header className="mb-6">
				<div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105">
					<Image
						src="/assets/images/PatientRoom.webp"
						alt="Cabinet médical moderne"
						fill
						style={{ objectFit: "cover" }}
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
						<h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
							Liste de vos patients
						</h1>
						<p className="mt-2 text-lg text-gray-200 max-w-2xl bg-gradient-to-r from-black/60 via-black/40 to-transparent">
							Consultez et gérez la liste de vos patients en toute
							simplicité
						</p>
					</div>
				</div>
			</header>

			{/* Barre de recherche et actions */}
			<div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
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
						className="pl-10 h-11 w-full rounded-md border shadow-sm"
					/>
				</div>
				<div className="flex gap-2">
					<Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" className="sm:hidden">
								<IconFilter className="h-4 w-4 mr-2" />
								<span>Filtres</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="bottom" className="h-[80vh]">
							<SheetHeader>
								<SheetTitle>Filtrer par lettre</SheetTitle>
							</SheetHeader>
							<div className="grid grid-cols-5 gap-4 p-4 mt-4">
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
									className="col-span-5 border-2 border-neutral-900 dark:border-white"
									onClick={handleResetFilters}
								>
									Réinitialiser
								</Button>
							</div>
						</SheetContent>
					</Sheet>
					<Button
						onClick={onAddPatientClick}
						className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 hover:scale-105"
					>
						<IconPlus size={18} className="mr-2" />
						Nouveau patient
					</Button>
				</div>
			</div>

			{/* Filtre alphabétique pour desktop */}
			<div className="hidden md:flex flex-wrap justify-center gap-2 mb-6">
				{alphabet.map((letter) => (
					<Button
						key={letter}
						aria-label={`Filtrer par lettre ${letter}`}
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

			{/* Liste des patients */}
			<div className="grid gap-6 p-2">
				{!sortedPatients.length ? (
					<div className="text-center py-8 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
							className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-3 sm:p-2"
							style={{
								animation: `fadeSlideIn 0.5s ease forwards ${
									index * 50
								}ms`,
								opacity: 0,
							}}
						>
							{/* HEADER */}
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
								<div className="flex items-center gap-2">
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
									<h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
										{`${patient.firstName || "Inconnu"} ${
											patient.lastName || ""
										}`}
										{patient.isDeceased && (
											<span className="inline-flex items-center gap-1 text-sm text-red-500">
												<IconSkull size={16} />
												<span className="hidden sm:inline">
													Décédé(e)
												</span>
											</span>
										)}
									</h3>
								</div>

								{/* BOUTONS ACTIONS */}
								<div className="flex flex-wrap gap-2 sm:flex-nowrap sm:items-center">
									<Button
										aria-label={`Voir les détails du patient ${patient.firstName} ${patient.lastName}`}
										variant="outline"
										size="sm"
										onClick={() =>
											setSelectedPatientId(
												selectedPatientId === patient.id
													? null
													: patient.id
											)
										}
										className="h-9 flex-1 sm:flex-none min-w-[100px] dark:hover:text-gray-900 dark:hover:bg-amber-500"
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
										className="h-9 flex-1 sm:flex-none min-w-[100px] dark:hover:text-gray-900 dark:hover:bg-amber-500"
									>
										<IconCalendar className="h-4 w-4 sm:mr-2" />
										<span className="hidden xs:inline sm:inline">
											Rendez-vous
										</span>
									</Button>
								</div>
							</div>

							{/* INFOS */}
							<div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
								<span>
									Âge : {calculateAge(patient.birthDate)} ans
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
										className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
									>
										<IconMail size={14} />
										{patient.email}
									</a>
								)}
							</div>

							{/* PATIENT DETAILS */}
							{selectedPatientId === patient.id && (
								<React.Suspense
									fallback={
										<div className="p-4 text-center">
											<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto" />
										</div>
									}
								>
									<PatientDetails
										patient={patient}
										onClose={() =>
											setSelectedPatientId(null)
										}
										onPatientDeleted={handlePatientDeleted}
										onPatientUpdated={handlePatientUpdated}
									/>
								</React.Suspense>
							)}

							{/* DIALOG */}
							{showAppointmentDialog && (
								<AppointmentDialog
									open={showAppointmentDialog}
									onOpenChange={setShowAppointmentDialog}
									selectedPatient={
										selectedPatientForAppointment
									}
									selectedDate={new Date()}
									patients={[]}
								/>
							)}
						</div>
					))
				)}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-center gap-2 mt-8">
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

			{/* Animations */}
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
					animation: fadeSlideIn 0.5s ease-in-out forwards;
				}
			`}</style>
		</div>
	);
};

export default React.memo(PatientList);
