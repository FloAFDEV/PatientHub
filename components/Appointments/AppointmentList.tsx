import React from "react";
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
import { Edit2, Trash2, XCircle, CalendarX } from "lucide-react";
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
	const [appointments, setAppointments] = React.useState<Appointment[]>([]);

	React.useEffect(() => {
		fetchAppointments();
	}, [date]);

	const fetchAppointments = async () => {
		try {
			const response = await fetch(
				`/api/appointments?date=${format(date, "yyyy-MM-dd")}`
			);
			if (!response.ok)
				throw new Error(
					"Erreur lors de la récupération des rendez-vous"
				);
			const data = await response.json();
			setAppointments(data);
		} catch (error) {
			console.error("Erreur:", error);
		}
	};

	if (appointments.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
				<CalendarX className="h-12 w-12 mb-4 opacity-50" />
				<p className="text-lg font-medium">
					Aucun rendez-vous pour cette date
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
			<Table>
				<TableHeader>
					<TableRow className="bg-gray-50 dark:bg-gray-800">
						<TableHead className="py-4 font-semibold text-gray-900 dark:text-white">
							Heure
						</TableHead>
						<TableHead className="py-4 font-semibold text-gray-900 dark:text-white">
							Patient
						</TableHead>
						<TableHead className="py-4 font-semibold text-gray-900 dark:text-white">
							Motif
						</TableHead>
						<TableHead className="py-4 font-semibold text-gray-900 dark:text-white">
							Statut
						</TableHead>
						<TableHead className="py-4 font-semibold text-gray-900 dark:text-white">
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{appointments.map((appointment) => (
						<TableRow
							key={appointment.id}
							className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
						>
							<TableCell className="py-4 font-medium">
								{format(new Date(appointment.date), "HH:mm")}
							</TableCell>
							<TableCell className="py-4">
								{appointment.patientName}
							</TableCell>
							<TableCell className="py-4">
								{appointment.reason}
							</TableCell>
							<TableCell className="py-4">
								<span
									className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
										appointment.status === "SCHEDULED"
											? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
											: appointment.status === "COMPLETED"
											? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
											: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
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
							<TableCell className="py-4">
								<div className="flex items-center space-x-3">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onEdit(appointment)}
										disabled={
											appointment.status === "CANCELED"
										}
										className="hover:bg-gray-100 dark:hover:bg-gray-700"
									>
										<Edit2 className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onDelete(appointment.id)}
										className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
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
											className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/30"
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
