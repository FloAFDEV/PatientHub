import React, { useState, useEffect } from "react";
import { AppointmentDialog } from "./AppointmentDialog";
import { AppointmentList } from "./AppointmentList";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Patient {
	id: number;
	name: string;
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
			toast.error("Erreur lors de l'annulation du rendez-vous");
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 max-w-7xl">
			<div className="flex flex-col md:flex-row gap-8">
				<div className="w-full md:w-1/3">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={(date) => date && setSelectedDate(date)}
							locale={fr}
							className="rounded-lg border-none"
							disabled={(date) => date < new Date()}
							classNames={{
								day_selected:
									"bg-primary text-primary-foreground hover:bg-primary/90",
								day_today: "bg-accent text-accent-foreground",
								day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
								day_disabled:
									"text-gray-400 dark:text-gray-600 hover:bg-transparent",
								nav_button:
									"h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
								nav_button_previous: "absolute left-1",
								nav_button_next: "absolute right-1",
								caption:
									"flex justify-center pt-1 relative items-center mb-4",
								caption_label: "text-lg font-semibold",
								table: "w-full border-collapse space-y-1",
								head_row: "flex",
								head_cell:
									"text-gray-500 dark:text-gray-400 font-normal text-sm w-9",
								row: "flex w-full mt-2",
								cell: "text-center text-sm relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
							}}
						/>
						<Button
							className="w-full mt-6 py-6 text-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
							onClick={() => setIsNewAppointmentOpen(true)}
							disabled={patients.length === 0}
						>
							Nouveau rendez-vous
						</Button>
					</div>
				</div>

				<div className="w-full md:w-2/3">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
						<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
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
