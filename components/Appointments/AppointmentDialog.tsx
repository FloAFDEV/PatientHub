import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, User, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Patient {
	id: number;
	firstName: string;
	lastName: string;
}

interface AppointmentType {
	id: number;
	date: string;
	time: string;
	patientId: number;
	patientName: string;
	reason: string;
	status: "SCHEDULED" | "COMPLETED" | "CANCELED";
}

interface AppointmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	patients: Patient[];
	selectedDate: Date;
	appointment?: AppointmentType;
	mode?: "create" | "edit";
	selectedPatient?: Patient | null;
}

interface FormValues {
	patientId: string;
	time: string;
	reason: string;
}

const generateTimes = () => {
	const times = [];
	const currentTime = new Date();
	currentTime.setHours(8, 0, 0, 0);

	while (currentTime.getHours() < 21) {
		const hour = currentTime.getHours().toString().padStart(2, "0");
		const minutes = currentTime.getMinutes().toString().padStart(2, "0");
		times.push(`${hour}:${minutes}`);
		currentTime.setMinutes(currentTime.getMinutes() + 45);
	}

	return times;
};

export function AppointmentDialog({
	open,
	onOpenChange,
	patients,
	selectedDate,
	appointment,
	mode = "create",
	selectedPatient,
}: AppointmentDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		defaultValues: {
			patientId:
				selectedPatient?.id?.toString() ||
				appointment?.patientId?.toString() ||
				"",
			time: appointment?.time || "08:00",
			reason: appointment?.reason || "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		try {
			if (!data.patientId) {
				form.setError("patientId", {
					type: "manual",
					message: "Patient requis.",
				});
				return;
			}
			if (!data.time) {
				form.setError("time", {
					type: "manual",
					message: "Heure requise.",
				});
				return;
			}
			if (!data.reason) {
				form.setError("reason", {
					type: "manual",
					message: "Motif requis.",
				});
				return;
			}

			const endpoint =
				mode === "create"
					? "/api/appointments"
					: `/api/appointments/${appointment?.id}`;
			const method = mode === "create" ? "POST" : "PUT";

			const response = await fetch(endpoint, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...data,
					date: format(selectedDate, "yyyy-MM-dd"),
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					`Erreur lors de la sauvegarde: ${
						errorData.message || response.statusText
					}`
				);
			}
			toast.success(
				mode === "create"
					? "Rendez-vous créé avec succès"
					: "Rendez-vous modifié avec succès"
			);
			onOpenChange(false);
		} catch (error) {
			console.error("Erreur détaillée:", error);
			toast.error(`Une erreur est survenue: ${(error as Error).message}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	const descriptionId = "appointment-dialog-description";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="sm:max-w-[500px] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
				aria-describedby={descriptionId}
			>
				<DialogHeader className="space-y-4">
					<DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
						{mode === "create" ? (
							<>
								<Calendar className="h-6 w-6 text-primary" />
								Nouveau rendez-vous
							</>
						) : (
							<>
								<Calendar className="h-6 w-6 text-primary" />
								Modifier le rendez-vous
							</>
						)}
					</DialogTitle>
					<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
						<Calendar className="h-4 w-4" />
						<span className="text-lg">
							{format(selectedDate, "EEEE dd MMMM yyyy", {
								locale: fr,
							})}
						</span>
					</div>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6 mt-6"
					>
						<FormField
							control={form.control}
							name="patientId"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
										<User className="h-4 w-4" />
										Patient
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										value={field.value}
									>
										<SelectTrigger className="h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
											<SelectValue placeholder="Sélectionner un patient" />
										</SelectTrigger>
										<SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
											{patients.map((patient) => (
												<SelectItem
													key={patient.id}
													value={patient.id.toString()}
													className="py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
												>
													{patient.firstName}{" "}
													{patient.lastName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="time"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
										<Clock className="h-4 w-4" />
										Heure
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										value={field.value}
									>
										<SelectTrigger className="h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
											<SelectValue placeholder="Sélectionner une heure" />
										</SelectTrigger>
										<SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
											{generateTimes().map((time) => (
												<SelectItem
													key={time}
													value={time}
													className="py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
												>
													{time}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="reason"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
										<FileText className="h-4 w-4" />
										Motif
									</FormLabel>
									<Input
										{...field}
										placeholder="Entrez le motif du rendez-vous"
									/>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-3 pt-6">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Annuler
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting
									? "Chargement..."
									: mode === "create"
									? "Créer"
									: "Modifier"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
