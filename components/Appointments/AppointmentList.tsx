"use client";

import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PencilIcon, Trash2Icon } from "lucide-react";

// Mapping des statuts vers des couleurs
const statusColors = {
	planned: "bg-blue-500",
	completed: "bg-green-500",
	cancelled: "bg-red-500",
};

// Types des données d'un rendez-vous et des props
export interface AppointmentListItem {
	id: number;
	date: string;
	reason?: string;
	status: "planned" | "completed" | "cancelled";
	patientId: string;
	patient?: {
		id: number; // ✅ Ajout de l'ID manquant pour correspondre à Patient complet
		firstName: string;
		lastName: string;
		phone?: string;
		email?: string;
	};
}

interface AppointmentListProps {
	appointments: AppointmentListItem[];
	onEdit: (appointment: AppointmentListItem) => void;
	onDelete: (appointment: AppointmentListItem) => void;
}

/**
 * Composant d'affichage des rendez-vous sous forme de liste.
 */
const AppointmentList: React.FC<AppointmentListProps> = ({
	appointments,
	onEdit,
	onDelete,
}) => {
	if (!appointments || appointments.length === 0) {
		return (
			<div className="text-center py-10 text-gray-500">
				Aucun rendez-vous prévu pour aujourd'hui.
			</div>
		);
	}

	return (
		<ScrollArea className="h-[500px] w-full rounded-md border p-2">
			<div className="space-y-4">
				{appointments.map((appt) => (
					<div
						key={appt.id}
						className="flex items-center justify-between bg-white dark:bg-slate-800 border rounded-xl p-4 shadow-sm"
					>
						<div className="flex flex-col space-y-1">
							<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
								{appt.patient?.firstName}{" "}
								{appt.patient?.lastName}
							</span>
							<span className="text-sm text-gray-500">
								{format(new Date(appt.date), "PPPP à HH:mm", {
									locale: fr,
								})}
							</span>
							{appt.reason && (
								<span className="text-sm text-gray-400 italic">
									Motif : {appt.reason}
								</span>
							)}
						</div>
						<div className="flex items-center space-x-2">
							<Badge
								className={`text-white ${
									statusColors[appt.status]
								}`}
							>
								{appt.status}
							</Badge>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => onEdit(appt)}
							>
								<PencilIcon className="w-4 h-4" />
							</Button>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => onDelete(appt)}
								title="Supprimer ce rendez-vous"
							>
								<Trash2Icon className="w-4 h-4 text-red-500" />
							</Button>
						</div>
					</div>
				))}
			</div>
		</ScrollArea>
	);
};

export default AppointmentList;
