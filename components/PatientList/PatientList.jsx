"use client";

import React, { useState } from "react";
import Image from "next/image";
import AddPatientForm from "@/components/addPatientForm/addPatientForm";
import { usePatients } from "@/hooks/usePatients";
import { useDebounce } from "@/hooks/useDebounce";
import {
	IconGenderMale,
	IconGenderFemale,
	IconSearch,
	IconPlus,
	IconChevronLeft,
	IconChevronRight,
	IconSkull,
	IconCalendar,
	IconRefresh,
} from "@tabler/icons-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { AppointmentDialog } from "@/components/Appointments/AppointmentDialog";
import { Input } from "@/components/ui/input";

const PatientDetails = React.lazy(() =>
	import("@/components/PatientDetails/PatientDetails")
);

const PatientList = ({ user }) => {
	const [selectedPatientId, setSelectedPatientId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchLetter, setSearchLetter] = useState("");
	const [showAddFormPatient, setShowAddFormPatient] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
	const [selectedPatientForAppointment, setSelectedPatientForAppointment] =
		useState(null);

	const debouncedSearchTerm = useDebounce(searchTerm);

	const { patients, totalPages, isLoading, isError, mutate } = usePatients(
		currentPage,
		debouncedSearchTerm,
		searchLetter
	);

	const handleAddAppointment = (patient) => {
		setSelectedPatientForAppointment(patient);
		setShowAppointmentDialog(true);
	};

	const calculateAge = (birthDate) => {
		if (!birthDate) return "N/A";
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
	};

	const handleResetFilters = () => {
		setSearchTerm("");
		setSearchLetter("");
		setCurrentPage(1);
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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

	return (
		<div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
			<header className="mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							Liste des patients
						</h1>
						<p className="mt-2 text-gray-600 dark:text-gray-400">
							Gérez vos patients et leurs rendez-vous
						</p>
					</div>
					<Image
						src="/assets/icons/logo-full.svg"
						alt="Logo"
						width={80}
						height={80}
						className="object-contain rounded-xl shadow-lg"
						priority
					/>
				</div>
			</header>

			<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
				<div className="relative w-full md:w-1/3">
					<IconSearch
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						size={20}
					/>
					<Input
						type="text"
						placeholder="Rechercher un patient..."
						value={searchTerm}
						onChange={handleSearchChange}
						className="pl-10"
					/>
				</div>
				<Button
					onClick={() => setShowAddFormPatient(true)}
					className="w-full md:w-auto flex items-center gap-2"
				>
					<IconPlus size={18} />
					Ajouter un patient
				</Button>
			</div>

			<div className="flex flex-wrap justify-center gap-2 mb-6">
				{alphabet.map((letter) => (
					<Button
						key={letter}
						variant={
							searchLetter === letter ? "default" : "outline"
						}
						className="w-10 h-10 p-0 rounded-full"
						onClick={() => handleLetterClick(letter)}
					>
						{letter}
					</Button>
				))}
				<Button
					variant={
						!searchLetter && !searchTerm ? "default" : "outline"
					}
					className="px-4"
					onClick={handleResetFilters}
				>
					Tous
				</Button>
			</div>

			<div className="space-y-4">
				{!patients?.length ? (
					<div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
						<IconSearch className="mx-auto h-12 w-12 text-gray-400" />
						<p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
							Aucun patient trouvé
						</p>
						<p className="mt-2 text-gray-500">
							Modifiez vos critères de recherche ou ajoutez un
							nouveau patient
						</p>
					</div>
				) : (
					patients.map((patient) => (
						<div
							key={patient.id}
							className="bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
						>
							<div className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
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
										<div>
											<h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
												{patient.name}
												{patient.isDeceased && (
													<span className="flex items-center gap-1 text-sm text-red-500">
														<IconSkull size={16} />
														Décédé(e)
													</span>
												)}
											</h3>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												<p>
													Âge:{" "}
													{calculateAge(
														patient.birthDate
													)}{" "}
													ans
												</p>
												{patient.phone && (
													<a
														href={`tel:${patient.phone}`}
														className="text-blue-600 dark:text-blue-400 hover:underline"
													>
														{patient.phone}
													</a>
												)}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												handleAddAppointment(patient)
											}
											className="flex items-center gap-2"
										>
											<IconCalendar className="h-4 w-4" />
											Rendez-vous
										</Button>
										<Button
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
										>
											{selectedPatientId === patient.id
												? "Fermer"
												: "Détails"}
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
									/>
								</React.Suspense>
							)}
						</div>
					))
				)}
			</div>

			{totalPages > 1 && (
				<div className="flex justify-between items-center mt-6">
					<Button
						variant="outline"
						onClick={() =>
							setCurrentPage((p) => Math.max(1, p - 1))
						}
						disabled={currentPage === 1}
					>
						<IconChevronLeft className="h-4 w-4" />
						Précédent
					</Button>
					<span className="text-sm text-gray-600 dark:text-gray-400">
						Page {currentPage} sur {totalPages}
					</span>
					<Button
						variant="outline"
						onClick={() =>
							setCurrentPage((p) => Math.min(totalPages, p + 1))
						}
						disabled={currentPage === totalPages}
					>
						Suivant
						<IconChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}

			{showAddFormPatient && (
				<AddPatientForm
					onClose={() => setShowAddFormPatient(false)}
					onAddPatient={() => {
						mutate();
						toast.success("Patient ajouté avec succès");
						setShowAddFormPatient(false);
					}}
				/>
			)}

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
