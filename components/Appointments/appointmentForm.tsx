"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { fr } from "date-fns/locale";

interface AppointmentFormProps {
	onSubmit: (appointment: {
		date: Date;
		time: string;
		reason: string;
		patientId: number;
	}) => void;
	patientId: number;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
	onSubmit,
	patientId,
}) => {
	const [date, setDate] = useState<Date>();
	const [time, setTime] = useState("");
	const [reason, setReason] = useState("");

	const availableTimes = [
		"09:00",
		"10:00",
		"11:00",
		"14:00",
		"15:00",
		"16:00",
		"17:00",
	];

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (date && time && reason) {
			onSubmit({
				date,
				time,
				reason,
				patientId,
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
					Date du rendez-vous
				</label>
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					locale={fr}
					className="rounded-md border"
					disabled={(date) =>
						date < new Date() || date.getDay() === 0
					}
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
					Heure du rendez-vous
				</label>
				<select
					value={time}
					onChange={(e) => setTime(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					required
				>
					<option value="">Sélectionnez une heure</option>
					{availableTimes.map((t) => (
						<option key={t} value={t}>
							{t}
						</option>
					))}
				</select>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
					Motif du rendez-vous
				</label>
				<textarea
					value={reason}
					onChange={(e) => setReason(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					rows={3}
					required
				/>
			</div>

			<Button type="submit" className="w-full">
				Confirmer le rendez-vous
			</Button>
		</form>
	);
};

export default AppointmentForm;
