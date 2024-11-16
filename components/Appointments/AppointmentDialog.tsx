import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
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
import { toast } from "react-toastify";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Appointment } from "./AppointmentsManager";

interface Patient {
	id: number;
	name: string;
}

interface AppointmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	patients: Patient[];
	selectedDate: Date;
	appointment?: Appointment;
	mode?: "create" | "edit";
}

interface FormValues {
	patientId: string;
	time: string;
	reason: string;
}

export function AppointmentDialog({
	open,
	onOpenChange,
	patients,
	selectedDate,
	appointment,
	mode = "create",
}: AppointmentDialogProps) {
	const form = useForm<FormValues>({
		defaultValues: {
			patientId: appointment?.patientId?.toString() || "",
			time: appointment?.time || "09:00",
			reason: appointment?.reason || "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		try {
			const endpoint =
				mode === "create"
					? "/api/appointments"
					: `/api/appointments/${appointment?.id}`;
			const method = mode === "create" ? "POST" : "PUT";

			const response = await fetch(endpoint, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					date: selectedDate,
				}),
			});

			if (!response.ok) throw new Error("Erreur lors de la sauvegarde");

			toast.success(
				mode === "create"
					? "Rendez-vous créé avec succès"
					: "Rendez-vous modifié avec succès"
			);
			onOpenChange(false);
			window.location.reload();
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Une erreur est survenue");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] p-6">
				<DialogHeader>
					<DialogTitle>
						{mode === "create"
							? "Nouveau rendez-vous"
							: "Modifier le rendez-vous"}
					</DialogTitle>
					<p className="text-sm text-gray-500 mt-2">
						Date :{" "}
						{format(selectedDate, "dd MMMM yyyy", { locale: fr })}
					</p>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="patientId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Patient</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Sélectionner un patient" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{patients.map((patient) => (
												<SelectItem
													key={patient.id}
													value={patient.id.toString()}
												>
													{patient.name}
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
									<FormLabel>Heure</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Sélectionner une heure" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{[
												"09:00",
												"10:00",
												"11:00",
												"14:00",
												"15:00",
												"16:00",
												"17:00",
											].map((time) => (
												<SelectItem
													key={time}
													value={time}
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
									<FormLabel>Motif</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end space-x-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Annuler
							</Button>
							<Button type="submit">
								{mode === "create" ? "Créer" : "Modifier"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
