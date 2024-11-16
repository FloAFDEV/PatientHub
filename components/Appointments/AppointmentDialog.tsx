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

export function AppointmentDialog({
	open,
	onOpenChange,
	patients,
	selectedDate,
	appointment,
	mode = "create",
}: AppointmentDialogProps) {
	const form = useForm({
		defaultValues: {
			patientId: appointment?.patientId?.toString() || "",
			time: appointment?.time || "09:00",
			reason: appointment?.reason || "",
		},
	});

	const onSubmit = async (data: any) => {
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
			toast.error("Une erreur est survenue");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
				<DialogHeader className="mb-6">
					<DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
						{mode === "create"
							? "Nouveau rendez-vous"
							: "Modifier le rendez-vous"}
					</DialogTitle>
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
									<FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300">
										Patient
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
												<SelectValue placeholder="Sélectionner un patient" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="bg-white dark:bg-gray-700">
											{patients.map((patient) => (
												<SelectItem
													key={patient.id}
													value={patient.id.toString()}
													className="hover:bg-gray-100 dark:hover:bg-gray-600"
												>
													{patient.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage className="text-sm text-red-500" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="time"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300">
										Heure
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
												<SelectValue placeholder="Sélectionner une heure" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="bg-white dark:bg-gray-700">
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
													className="hover:bg-gray-100 dark:hover:bg-gray-600"
												>
													{time}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage className="text-sm text-red-500" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="reason"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300">
										Motif
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
										/>
									</FormControl>
									<FormMessage className="text-sm text-red-500" />
								</FormItem>
							)}
						/>

						<div className="flex justify-end space-x-3 pt-6">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								className="px-6 py-2 text-base"
							>
								Annuler
							</Button>
							<Button
								type="submit"
								className="px-6 py-2 text-base"
							>
								{mode === "create" ? "Créer" : "Modifier"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
