import React from "react";
import { format } from "date-fns";
import { Edit2, Trash2, Calendar } from "lucide-react";
import useSWR from "swr";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AppointmentType } from "./AppointmentsManager";

interface AppointmentListProps {
	date: Date;
	onEdit: (appointment: AppointmentType) => void;
	onDelete: (appointmentId: number) => Promise<void>;
	onCancel: (appointmentId: number) => Promise<void>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AppointmentList({ date, onEdit }: AppointmentListProps) {
	const {
		data: appointments,
		error,
		mutate,
	} = useSWR<AppointmentType[]>(
		`/api/appointments?date=${format(date, "yyyy-MM-dd")}`,
		fetcher,
		{
			revalidateOnFocus: false,
			dedupingInterval: 5000,
		}
	);

	const isLoading = !appointments && !error;

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

	if (error) {
		return (
			<div className="text-center py-8 text-red-500">
				<p>Impossible de charger les rendez-vous</p>
				<Button
					onClick={() => mutate()}
					variant="outline"
					className="mt-4"
				>
					Réessayer
				</Button>
			</div>
		);
	}

	if (!appointments?.length) {
		return (
			<div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl">
				<Calendar className="h-12 w-12 mb-4 opacity-50" />
				<p className="text-2xl font-medium p-4">
					Aucun rendez-vous pour cette date
				</p>
				<p className="text-sm mt-2 p-4">
					Cliquez sur &quot;Nouveau rendez-vous&quot; pour en créer un
				</p>
			</div>
		);
	}

	const handleAction = async (
		action: "delete" | "cancel",
		appointmentId: number
	) => {
		try {
			const endpoint =
				action === "delete"
					? `/api/appointments/${appointmentId}`
					: `/api/appointments/${appointmentId}/cancel`;
			const method = action === "delete" ? "DELETE" : "PUT";
			const response = await fetch(endpoint, { method });
			if (!response.ok) {
				throw new Error(`Erreur lors de l'action ${action}`);
			}
			// Revalider les données après une action réussie
			mutate();
		} catch (error) {
			console.error(`Erreur lors de l'action ${action}:`, error);
		}
	};

	return (
		<div className="rounded-lg border border-gray-200 dark:border-gray-700">
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
											? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
											: appointment.status === "COMPLETED"
											? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
											: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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
										onClick={() =>
											handleAction(
												"delete",
												appointment.id
											)
										}
										className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
									{appointment.status === "SCHEDULED" && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												handleAction(
													"cancel",
													appointment.id
												)
											}
											className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
										></Button>
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
