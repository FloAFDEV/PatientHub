"use client";

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

/**
 * Propriétés acceptées par la liste des rendez-vous :
 *  - date : la date pour laquelle on affiche les rendez-vous
 *  - onEdit : callback pour éditer un rendez-vous (ouvre modal par ex.)
 *  - onDelete : callback pour supprimer un rendez-vous
 *  - onCancel : callback pour annuler un rendez-vous (status = "CANCELED")
 */
interface AppointmentListProps {
	date: Date;
	onEdit: (appointment: AppointmentType) => void;
	onDelete: (appointmentId: number) => Promise<void>;
	onCancel: (appointmentId: number) => Promise<void>;
}

/**
 * Fetcher utilisé par SWR : simple GET qui parse la réponse en JSON.
 */
const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Composant qui affiche la liste des rendez-vous du jour.
 * Il gère l'état de chargement, l'erreur, et appelle onEdit/onDelete/onCancel sur les actions.
 */
export function AppointmentList({
	date,
	onEdit,
	onDelete,
	onCancel,
}: AppointmentListProps) {
	// -- Récupération via SWR des RDV du jour
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

	// État de chargement tant qu'on n'a pas de data ni d'erreur
	const isLoading = !appointments && !error;

	// -- Gestion de l'état de chargement
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100 dark:bg-gray-900">
				<div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-primary rounded-full"></div>
			</div>
		);
	}

	// -- Gestion de l'erreur
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

	// -- Pas de rendez-vous
	if (!appointments?.length) {
		return (
			<div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl">
				<Calendar className="h-12 w-12 mb-4 opacity-50" />
				<p className="text-2xl font-medium p-4">
					Aucun rendez-vous pour cette date
				</p>
				<p className="text-sm mt-2 p-4">
					Cliquez sur le calendrier pour en créer
				</p>
			</div>
		);
	}

	// -- Appels aux callbacks parent : onDelete / onCancel
	//    puis on "mutate" pour rafraîchir la liste
	const handleAction = async (
		action: "delete" | "cancel",
		appointmentId: number
	) => {
		try {
			if (action === "delete") {
				await onDelete(appointmentId);
			} else {
				await onCancel(appointmentId);
			}
			// Après suppression/annulation, on revalide la liste
			mutate();
		} catch (error) {
			console.error(`Erreur lors de l'action ${action}:`, error);
		}
	};

	// -- Rendu principal
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

							{/* Statut (badge coloré) */}
							<TableCell>
								<span
									className={`px-2 py-1 rounded-full text-sm ${
										appointment.status === "SCHEDULED"
											? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
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

							{/* Boutons d'action */}
							<TableCell className="text-right">
								<div className="flex justify-end space-x-2">
									{/* Bouton éditer */}
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

									{/* Bouton supprimer */}
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

									{/* Bouton annuler (uniquement si SCHEDULED) */}
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
										>
											Annuler
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
