"use client";

import React, { useState, useEffect, FC } from "react";
import { format } from "date-fns";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import type { Appointment } from "./AppointmentsManager";

interface Patient {
	id: string;
	firstName: string;
	lastName: string;
}

interface AppointmentDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: (appointment: Appointment) => void;
	appointment?: Appointment | null;
	patients: Patient[];
}

const statusOptions = [
	{ value: "planned", label: "Prévu" },
	{ value: "completed", label: "Terminé" },
	{ value: "cancelled", label: "Annulé" },
];

const AppointmentDialog: FC<AppointmentDialogProps> = ({
	open,
	onClose,
	onSave,
	appointment,
	patients,
}) => {
	const [formData, setFormData] = useState<{
		patientId: string;
		date: string;
		time: string;
		reason: string;
		status: Appointment["status"];
	}>({
		patientId: "",
		date: "",
		time: "",
		reason: "",
		status: "planned",
	});

	useEffect(() => {
		if (appointment) {
			const dateObj = new Date(appointment.date);
			setFormData({
				patientId: appointment.patientId,
				date: format(dateObj, "yyyy-MM-dd"),
				time: format(dateObj, "HH:mm"),
				reason: appointment.reason || "",
				status: appointment.status,
			});
		} else {
			setFormData({
				patientId: "",
				date: "",
				time: "",
				reason: "",
				status: "planned",
			});
		}
	}, [appointment]);

	const handleChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = () => {
		const fullDate = new Date(`${formData.date}T${formData.time}`);
		const appointmentData: Appointment = {
			id: appointment?.id ?? 0,
			patientId: formData.patientId,
			date: fullDate.toISOString(),
			reason: formData.reason,
			status: formData.status,
		};

		if (appointment?.id !== undefined) {
			appointmentData.id = appointment.id;
		}

		onSave(appointmentData);
		onClose();
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{appointment
							? "Modifier le rendez-vous"
							: "Nouveau rendez-vous"}
					</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{/* Patient */}
					<div className="grid gap-2">
						<Label>Patient</Label>
						<Select
							value={formData.patientId}
							onValueChange={(value) =>
								handleChange("patientId", value)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Sélectionner un patient" />
							</SelectTrigger>
							<SelectContent>
								{patients.map((p) => (
									<SelectItem key={p.id} value={p.id}>
										{p.firstName} {p.lastName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Date */}
					<div className="grid gap-2">
						<Label>Date</Label>
						<Input
							type="date"
							value={formData.date}
							onChange={(e) =>
								handleChange("date", e.target.value)
							}
						/>
					</div>

					{/* Heure */}
					<div className="grid gap-2">
						<Label>Heure</Label>
						<Input
							type="time"
							value={formData.time}
							onChange={(e) =>
								handleChange("time", e.target.value)
							}
						/>
					</div>

					{/* Motif */}
					<div className="grid gap-2">
						<Label>Motif</Label>
						<Textarea
							placeholder="Détail du rendez-vous"
							value={formData.reason}
							onChange={(e) =>
								handleChange("reason", e.target.value)
							}
						/>
					</div>

					{/* Statut */}
					<div className="grid gap-2">
						<Label>Statut</Label>
						<Select
							value={formData.status}
							onValueChange={(value) =>
								handleChange(
									"status",
									value as Appointment["status"]
								)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Choisir un statut" />
							</SelectTrigger>
							<SelectContent>
								{statusOptions.map((s) => (
									<SelectItem key={s.value} value={s.value}>
										{s.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Annuler
					</Button>
					<Button onClick={handleSubmit}>
						{appointment ? "Mettre à jour" : "Créer"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AppointmentDialog;
