"use client";

import React, { useState, useEffect } from "react";
import AppointmentList, {
	AppointmentListItem,
} from "@/components/Appointments/AppointmentList";
import AppointmentDialog from "@/components/Appointments/AppointmentDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatISO } from "date-fns";
import { Label } from "@/components/ui/label";

interface Patient {
	id: string;
	firstName: string;
	lastName: string;
}

export interface Appointment extends Omit<AppointmentListItem, "id"> {
	id: number;
	patientId: string;
	patient?: {
		id: number;
		firstName: string;
		lastName: string;
		phone?: string;
		email?: string;
	};
}

const AppointmentsManager: React.FC = () => {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [selectedDate, setSelectedDate] = useState<string>(
		formatISO(new Date(), { representation: "date" })
	);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingAppointment, setEditingAppointment] =
		useState<Appointment | null>(null);

	useEffect(() => {
		// Récupération des rendez-vous de l'API en fonction de la date sélectionnée
		fetch(`/api/appointments?date=${selectedDate}`)
			.then((res) => res.json())
			.then((data) => setAppointments(data))
			.catch((err) =>
				console.error("Erreur de chargement des rendez-vous:", err)
			);

		// Récupération des patients de l'API
		fetch("/api/patients")
			.then((res) => res.json())
			.then((data) => setPatients(data))
			.catch((err) =>
				console.error("Erreur de chargement des patients:", err)
			);
	}, [selectedDate]);

	const handleSaveAppointment = async (appt: Appointment) => {
		const res = await fetch("/api/appointments", {
			method: appt.id ? "PATCH" : "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(appt),
		});

		if (res.ok) {
			const updated = await res.json();
			setAppointments((prev) => {
				const exists = prev.find((a) => a.id === updated.id);
				if (exists) {
					return prev.map((a) => (a.id === updated.id ? updated : a));
				} else {
					return [...prev, updated];
				}
			});
		}
	};

	const handleDeleteAppointment = async (appt: Appointment) => {
		if (!window.confirm("Confirmer la suppression de ce rendez-vous ?"))
			return;
		const res = await fetch(`/api/appointments?id=${appt.id}`, {
			method: "DELETE",
		});
		if (res.ok) {
			setAppointments((prev) => prev.filter((a) => a.id !== appt.id));
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-bold">Rendez-vous du jour</h2>
				<Button
					onClick={() => {
						setEditingAppointment(null);
						setDialogOpen(true);
					}}
				>
					<PlusCircle className="w-4 h-4 mr-2" /> Nouveau
				</Button>
			</div>

			{/* Sélecteur de date */}
			<div className="grid gap-2">
				<Label>Date</Label>
				<Input
					type="date"
					value={selectedDate}
					onChange={(e) => setSelectedDate(e.target.value)} // Change la date sélectionnée
				/>
			</div>

			<AppointmentList
				appointments={appointments}
				onEdit={(appt) => {
					setEditingAppointment(appt);
					setDialogOpen(true);
				}}
				onDelete={handleDeleteAppointment}
			/>

			<AppointmentDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				onSave={handleSaveAppointment}
				appointment={editingAppointment}
				patients={patients}
			/>
		</div>
	);
};

export default AppointmentsManager;
