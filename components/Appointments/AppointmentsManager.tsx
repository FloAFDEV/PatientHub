import React, { useState, useEffect } from "react";
import { AppointmentDialog } from "./AppointmentDialog";
import { AppointmentList } from "./AppointmentList";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

interface Patient {
	id: number;
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
}

export interface Appointment {
	id: number;
	date: string;
	time: string;
	patientId: number;
	patientName: string;
	reason: string;
	status: "SCHEDULED" | "COMPLETED" | "CANCELED";
}

export default function AppointmentsManager() {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
	const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
	const [selectedAppointment, setSelectedAppointment] =
		useState<Appointment | null>(null);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchPatients();
	}, []);

	const fetchPatients = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/patients?fetchAll=true");
			if (!response.ok)
				throw new Error("Erreur lors du chargement des patients");
			const data = await response.json();
			setPatients(data);
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors du chargement des patients");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditAppointment = (appointment: Appointment) => {
		setSelectedAppointment(appointment);
		setIsEditAppointmentOpen(true);
	};

	const handleDeleteAppointment = async (appointmentId: number) => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?"))
			return;

		try {
			const response = await fetch(`/api/appointments/${appointmentId}`, {
				method: "DELETE",
			});

			if (!response.ok) throw new Error("Erreur lors de la suppression");

			toast.success("Rendez-vous supprimé avec succès");
			window.location.reload();
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de la suppression du rendez-vous");
		}
	};

	const handleCancelAppointment = async (appointmentId: number) => {
		try {
			const response = await fetch(
				`/api/appointments/${appointmentId}/cancel`,
				{
					method: "PUT",
				}
			);

			if (!response.ok) throw new Error("Erreur lors de l'annulation");

			toast.success("Rendez-vous annulé avec succès");
			window.location.reload();
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de l'annulation du rendez-vous");
		}
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

	return (
		<div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
			<header className="mb-8">
				<div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden rounded-lg shadow-xl mb-8">
					<Image
						src="/assets/images/Planning.webp"
						alt="Modern Planning Desktop"
						fill
						style={{
							objectFit: "cover",
							objectPosition: "center 30%",
						}}
						className="opacity-80"
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
							Rendez-vous / Planning
						</h1>
						<p className="mt-2 text-xl drop-shadow-sm hidden sm:block">
							Informations et paramètres de votre agenda médical
						</p>
					</div>
				</div>
			</header>
			<div className="flex flex-col md:flex-row gap-8">
				<div className="w-full md:w-2/3">
					<div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-lg">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={(date) => date && setSelectedDate(date)}
							locale={fr}
							className="rounded-lg border-none"
							disabled={(date) => date < new Date()}
						/>
						<Button
							className="w-full mt-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700"
							onClick={() => setIsNewAppointmentOpen(true)}
						>
							Nouveau rendez-vous
						</Button>
					</div>
				</div>

				<div className="w-full md:w-2/3">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
						<h2 className="text-2xl font-bold mb-6">
							Rendez-vous du{" "}
							{format(selectedDate, "dd MMMM yyyy", {
								locale: fr,
							})}
						</h2>
						<AppointmentList
							date={selectedDate}
							onEdit={handleEditAppointment}
							onDelete={handleDeleteAppointment}
							onCancel={handleCancelAppointment}
						/>
					</div>
				</div>
			</div>

			<AppointmentDialog
				open={isNewAppointmentOpen}
				onOpenChange={setIsNewAppointmentOpen}
				patients={patients}
				selectedDate={selectedDate}
			/>

			{selectedAppointment && (
				<AppointmentDialog
					open={isEditAppointmentOpen}
					onOpenChange={setIsEditAppointmentOpen}
					patients={patients}
					selectedDate={selectedDate}
					appointment={selectedAppointment}
					mode="edit"
				/>
			)}
		</div>
	);
}
