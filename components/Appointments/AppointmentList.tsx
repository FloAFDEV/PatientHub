import React, { useCallback, useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Edit2, Trash2, XCircle, Calendar } from "lucide-react";
import { Appointment } from "./AppointmentsManager";

interface AppointmentListProps {
	date: Date;
	onEdit: (appointment: Appointment) => void;
	onDelete: (appointmentId: number) => void;
	onCancel: (appointmentId: number) => void;
}

export function AppointmentList({
	date,
	onEdit,
	onDelete,
	onCancel,
}: AppointmentListProps) {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAppointments = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
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
		} catch (err) {
			setError("Impossible de charger les rendez-vous");
			console.error("Erreur:", err);
		} finally {
			setIsLoading(false);
		}
	}, [date]);

	useEffect(() => {
		fetchAppointments();
	}, [fetchAppointments]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8 text-red-500">
				<p>{error}</p>
				<Button
					onClick={() => fetchAppointments()}
					variant="outline"
					className="mt-4"
				>
					Réessayer
				</Button>
			</div>
		);
	}

	if (appointments.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-gray-500">
				<Calendar className="h-12 w-12 mb-4 opacity-50" />
				<p className="text-lg font-medium">
					Aucun rendez-vous pour cette date
				</p>
				<p className="text-sm mt-2">
					Cliquez sur "Nouveau rendez-vous" pour en créer un
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-gray-200">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Heure</TableHead>
						<TableHead>Patient</TableHead>
						<TableHead>Motif</TableHead>
						<TableHead>Statut</TableHead>
						<TableHead className="text-right">Actions</TableHead>
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
								<span
									className={`px-2 py-1 rounded-full text-sm ${
										appointment.status === "SCHEDULED"
											? "bg-blue-100 text-blue-800"
											: appointment.status === "COMPLETED"
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{appointment.status === "SCHEDULED" &&
										"Prévu"}
									{appointment.status === "COMPLETED" &&
										"Terminé"}
									{appointment.status === "CANCELED" &&
										"Annulé"}
								</span>
							</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end space-x-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onEdit(appointment)}
										disabled={
											appointment.status === "CANCELED"
										}
									>
										<Edit2 className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onDelete(appointment.id)}
										className="text-red-600 hover:text-red-700"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
									{appointment.status === "SCHEDULED" && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												onCancel(appointment.id)
											}
											className="text-orange-600 hover:text-orange-700"
										>
											<XCircle className="h-4 w-4" />
										</Button>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
