"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface Appointment {
	id: number;
	date: string;
	patientName: string;
	reason: string;
	status: "SCHEDULED" | "COMPLETED" | "CANCELED";
}

interface AppointmentListProps {
	date: Date;
}

export function AppointmentList({ date }: AppointmentListProps) {
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				const response = await fetch(
					`/api/appointments?date=${format(date, "yyyy-MM-dd")}`
				);
				if (!response.ok) {
					throw new Error(
						"Erreur lors de la récupération des rendez-vous"
					);
				}
				const data = await response.json();
				setAppointments(data);
			} catch (error) {
				console.error("Erreur:", error);
			}
		};

		fetchAppointments();
	}, [date]);

	if (appointments.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				Aucun rendez-vous pour cette date
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Heure</TableHead>
					<TableHead>Patient</TableHead>
					<TableHead>Motif</TableHead>
					<TableHead>Statut</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{appointments.map((appointment) => (
					<TableRow key={appointment.id}>
						<TableCell>
							{format(new Date(appointment.date), "HH:mm")}
						</TableCell>
						<TableCell>{appointment.patientName}</TableCell>
						<TableCell>{appointment.reason}</TableCell>
						<TableCell>
							{appointment.status === "SCHEDULED" && "Prévu"}
							{appointment.status === "COMPLETED" && "Terminé"}
							{appointment.status === "CANCELED" && "Annulé"}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
