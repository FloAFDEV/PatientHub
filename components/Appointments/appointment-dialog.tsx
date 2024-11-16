"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/components/lib/utils";
import { CalendarIcon } from "lucide-react";

interface AppointmentFormValues {
	patientName: string;
	date: Date;
	reason: string;
}

interface AppointmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AppointmentDialog({
	open,
	onOpenChange,
}: AppointmentDialogProps) {
	const form = useForm<AppointmentFormValues>({
		defaultValues: {
			patientName: "",
			reason: "",
		},
	});

	async function onSubmit(data: AppointmentFormValues) {
		try {
			if (!data.patientName || !data.date || !data.reason) {
				return;
			}

			const response = await fetch("/api/appointments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Erreur lors de la création du rendez-vous");
			}

			onOpenChange(false);
			form.reset();
		} catch (error) {
			console.error("Erreur:", error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Nouveau rendez-vous</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="patientName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom du patient</FormLabel>
									<FormControl>
										<Input {...field} required />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Date du rendez-vous</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value &&
															"text-muted-foreground"
													)}
												>
													{field.value ? (
														format(
															field.value,
															"PPP",
															{ locale: fr }
														)
													) : (
														<span>
															Choisir une date
														</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0"
											align="start"
										>
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) =>
													date < new Date() ||
													date <
														new Date("1900-01-01")
												}
												initialFocus
												locale={fr}
											/>
										</PopoverContent>
									</Popover>
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
										<Input {...field} required />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Annuler
							</Button>
							<Button type="submit">Créer</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
