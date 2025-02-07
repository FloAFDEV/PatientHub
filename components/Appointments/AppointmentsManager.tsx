import React, { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";
import { AppointmentDialog } from "./AppointmentDialog";
import { AppointmentList } from "./AppointmentList";
import FullCalendar from "@fullcalendar/react";
import { EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";

export interface AppointmentType {
	id: number;
	date: string;
	time: string;
	patientId: number;
	patientName: string;
	reason: string;
	status: "SCHEDULED" | "COMPLETED" | "CANCELED";
}

export interface Patient {
	id: number;
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
}

const getEasterMonday = (year: number) => {
	const f = Math.floor(year / 100);
	const g = Math.floor(year % 100);
	const c = Math.floor(f / 4);
	const e = Math.floor(f % 4);
	const h = Math.floor((8 * f + 13) / 25);
	const l = Math.floor((19 * g + f - c - h + 15) % 30);
	const p = Math.floor(g / 4);
	const q = Math.floor((32 + 2 * e + 2 * p - l) % 7);
	const r = Math.floor((l + q - 7) % 7);
	const easterDate = new Date(year, 2, 1);
	easterDate.setDate(22 + r + (l == 29 || (l == 28 && r == 6) ? 1 : 0));
	const easterMonday = new Date(easterDate);
	easterMonday.setDate(easterDate.getDate() + 1);
	return easterMonday.getDate();
};

const getEasterDate = (year: number) => {
	const f = Math.floor(year / 100);
	const g = year % 19;
	const c = Math.floor(
		(15 + 19 * g + Math.floor(f / 4) - Math.floor((f + 8) / 25)) % 30
	);
	const h = Math.floor(
		(32 + 2 * (year % 4) + 2 * Math.floor(year / 4) - c - (year % 7)) % 7
	);
	const easterDate = new Date(year, 2, 1);
	easterDate.setDate(22 + c + h);
	return easterDate;
};

const getAscensionDay = (year: number) => {
	const easterDate = getEasterDate(year);
	const ascensionDate = new Date(easterDate);
	ascensionDate.setDate(easterDate.getDate() + 39);
	return ascensionDate.getDate();
};

const getWhitMonday = (year: number) => {
	const easterDate = getEasterDate(year);
	const whitMondayDate = new Date(easterDate);
	whitMondayDate.setDate(easterDate.getDate() + 50);
	return whitMondayDate.getDate();
};

const generateHolidaysAndVacations = (
	startYear: number,
	endYear: number,
	zone: string
) => {
	const events = [];

	for (let year = startYear; year <= endYear; year++) {
		const easterMondayDate = getEasterMonday(year);
		const ascensionDayDate = getAscensionDay(year);
		const whitMondayDate = getWhitMonday(year);

		events.push(
			{
				title: "Jour de l'An",
				start: `${year}-01-01`,
				allDay: true,
				color: "#0c4a6e",
			},
			{
				title: "Lundi de Pâques",
				start: `${year}-04-${easterMondayDate}`,
				allDay: true,
				color: "#0c4a6e",
			},
			{
				title: "Fête du Travail",
				start: `${year}-05-01`,
				allDay: true,
				color: "#0c4a6e",
			},
			{
				title: "Victoire 1945",
				start: `${year}-05-08`,
				allDay: true,
				color: "#0c4a6e",
			},
			{
				title: "Ascension",
				start: `${year}-05-${ascensionDayDate}`,
				allDay: true,
				color: "#0c4a6e",
			},
			{
				title: "Lundi de Pentecôte",
				start: `${year}-06-${whitMondayDate}`,
				allDay: true,
				color: "#0c4a6e",
			},
			{
				title: "Fête Nationale",
				start: `${year}-07-14`,
				allDay: true,
				color: "#0c4a6e",
			},
			{
				title: "Assomption",
				start: `${year}-08-15`,
				allDay: true,
				color: "#0c4a6e",
			},
			{
				title: "Toussaint",
				start: `${year}-11-01`,
				allDay: true,
				color: "#0c4a6e",
			},
			{
				title: "Armistice 1918",
				start: `${year}-11-11`,
				allDay: true,
				color: "#0c4a6e",
			},
			{
				title: "Noël",
				start: `${year}-12-25`,
				allDay: true,
				color: "#0c4a6e",
			}
		);

		const winterHolidays = getWinterHolidays(year, zone);
		const springHolidays = getSpringHolidays(year, zone);
		events.push(
			{
				title: "Vacances d'hiver",
				start: winterHolidays.start,
				end: winterHolidays.end,
				color: "#0c4a6e",
			},
			{
				title: "Vacances de printemps",
				start: springHolidays.start,
				end: springHolidays.end,
				color: "#0c4a6e",
			},
			{
				title: "Vacances d'été",
				start: `${year}-07-06`,
				end: `${year}-08-31`,
				color: "#0c4a6e",
			},
			{
				title: "Vacances de la Toussaint",
				start: `${year}-10-19`,
				end: `${year}-11-03`,
				color: "#0c4a6e",
			},
			{
				title: "Vacances de Noël",
				start: `${year}-12-21`,
				end: `${year + 1}-01-05`,
				color: "#0c4a6e",
			}
		);
	}

	return events;
};

const getWinterHolidays = (year: number, zone: string) => {
	switch (zone) {
		case "A":
			return { start: `${year}-02-08`, end: `${year}-02-24` };
		case "B":
			return { start: `${year}-02-22`, end: `${year}-03-10` };
		case "C":
			return { start: `${year}-02-15`, end: `${year}-03-03` };
		default:
			return { start: `${year}-02-15`, end: `${year}-03-03` };
	}
};

const getSpringHolidays = (year: number, zone: string) => {
	switch (zone) {
		case "A":
			return { start: `${year}-04-12`, end: `${year}-04-28` };
		case "B":
			return { start: `${year}-04-26`, end: `${year}-05-12` };
		case "C":
			return { start: `${year}-04-19`, end: `${year}-05-05` };
		default:
			return { start: `${year}-04-19`, end: `${year}-05-05` };
	}
};

export default function AppointmentsManager() {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
	const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
	const [selectedAppointment, setSelectedAppointment] =
		useState<AppointmentType | null>(null);
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
		null
	);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [events, setEvents] = useState<AppointmentType[]>([]);
	const [holidaysAndVacations, setHolidaysAndVacations] = useState<
		{
			title: string;
			start: string;
			end?: string;
			allDay?: boolean;
			color: string;
		}[]
	>([]);
	const [selectedZone, setSelectedZone] = useState<string>("A");

	useEffect(() => {
		fetchPatients();
		checkForPatientInUrl();
		fetchAppointments();
		const currentYear = new Date().getFullYear();
		const generatedEvents = generateHolidaysAndVacations(
			currentYear,
			currentYear + 100,
			selectedZone
		);
		setHolidaysAndVacations(generatedEvents);
	}, [selectedZone]);

	const checkForPatientInUrl = () => {
		const params = new URLSearchParams(window.location.search);
		const patientId = params.get("patientId");
		const firstName = params.get("firstName");
		const lastName = params.get("lastName");

		if (patientId && firstName && lastName) {
			setSelectedPatient({
				id: parseInt(patientId),
				firstName,
				lastName,
			});
			setIsNewAppointmentOpen(true);
		}
	};

	const fetchPatients = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/patients?fetchAll=true");
			if (!response.ok)
				throw new Error("Erreur lors du chargement des patients");
			const data = await response.json();
			setPatients(data);
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors du chargement des patients");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchAppointments = async () => {
		try {
			const response = await fetch("/api/appointments");
			if (!response.ok)
				throw new Error("Erreur lors du chargement des rendez-vous");
			const data = await response.json();
			const formattedEvents = data.map(
				(appointment: AppointmentType) => ({
					id: appointment.id.toString(),
					title: `${appointment.patientName} - ${appointment.reason}`,
					start: `${appointment.date}T${appointment.time}`,
					status: appointment.status,
				})
			);
			setEvents(formattedEvents);
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors du chargement des rendez-vous");
		}
	};

	const handleEditAppointment = (appointment: AppointmentType) => {
		setSelectedAppointment(appointment);
		setIsEditAppointmentOpen(true);
	};

	const handleDeleteAppointment = async (appointmentId: number) => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?"))
			return;
		try {
			const response = await fetch(`/api/appointments/${appointmentId}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Erreur lors de la suppression");
			toast.success("Rendez-vous supprimé avec succès");
			fetchAppointments();
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de la suppression du rendez-vous");
		}
	};

	const handleCancelAppointment = async (appointmentId: number) => {
		try {
			const response = await fetch(
				`/api/appointments/${appointmentId}/cancel`,
				{ method: "PUT" }
			);
			if (!response.ok) throw new Error("Erreur lors de l'annulation");
			toast.success("Rendez-vous annulé avec succès");
			fetchAppointments();
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de l'annulation du rendez-vous");
		}
	};

	const handleDateClick = (arg: { date: Date }) => {
		setSelectedDate(arg.date);
		setIsNewAppointmentOpen(true);
	};

	const handleEventClick = (info: { event: { id: string } }) => {
		const appointment = events.find(
			(event) => event.id === parseInt(info.event.id)
		);
		if (appointment) {
			setSelectedAppointment(appointment);
			setIsEditAppointmentOpen(true);
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100 dark:bg-gray-900">
				<div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-primary rounded-full"></div>
				<p className="mt-4 text-gray-600 dark:text-gray-400">
					Chargement...
				</p>
			</div>
		);
	}

	return (
		<div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
			<header className="mb-8">
				<div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden rounded-lg shadow-xl mb-8">
					<Image
						src="/assets/images/Planning.webp"
						alt="Modern Planning Desktop"
						className="w-full h-full object-cover object-center opacity-80"
						style={{ objectPosition: "center 30%" }}
						layout="fill"
					/>
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 bg-black bg-opacity-40 rounded-lg">
						<h1 className="mt-2 text-3xl font-bold drop-shadow-sm">
							Rendez-vous / Planning
						</h1>
						<p className="mt-2 text-xl drop-shadow-sm hidden sm:block">
							Informations et paramètres de votre agenda médical
						</p>
					</div>
				</div>
			</header>

			<div className="flex flex-col gap-8">
				<div className="w-full mt-8">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
						<h2 className="text-2xl font-bold mb-6">
							Rendez-vous du{" "}
							{format(selectedDate, "dd MMMM yyyy", {
								locale: fr,
							})}
						</h2>
						<AppointmentList
							date={selectedDate}
							onEdit={handleEditAppointment}
							onDelete={handleDeleteAppointment}
							onCancel={handleCancelAppointment}
						/>
					</div>
				</div>
				<div className="w-full h-full">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
						<div className="mb-4">
							<label
								htmlFor="zone-select"
								className="block text-md font-medium text-gray-700 dark:text-gray-300"
							>
								Zones scolaire
							</label>
							<select
								id="zone-select"
								value={selectedZone}
								onChange={(e) =>
									setSelectedZone(e.target.value)
								}
								className="mt-1 block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							>
								<option value="A">Zone A</option>
								<option value="B">Zone B</option>
								<option value="C">Zone C</option>
							</select>
						</div>
						<div className="mb-6">
							<FullCalendar
								plugins={[
									dayGridPlugin,
									interactionPlugin,
									timeGridPlugin,
								]}
								initialView="dayGridMonth"
								locale={frLocale}
								firstDay={1}
								events={[
									...events.map((event) => ({
										...event,
										id: event.id.toString(),
									})),
									...holidaysAndVacations,
								]}
								dateClick={handleDateClick}
								eventClick={handleEventClick}
								height="auto"
								dayCellClassNames={({
									date,
									isToday,
								}: {
									date: Date;
									isToday: boolean;
								}) => {
									const day = date.getDay();
									const isWeekend = day === 0 || day === 6;
									const baseClass = isWeekend
										? "text-red-500"
										: "text-gray-800";
									const darkModeClass = isWeekend
										? "dark:bg-cyan-950 dark:text-red-500"
										: "dark:bg-gray-800 dark:text-white";
									const todayClass = isToday
										? "bg-blue-500 text-white dark:bg-amber-600 dark:text-green-500 font-bold"
										: "";
									return `${baseClass} ${darkModeClass} ${todayClass}`;
								}}
								dayHeaderClassNames="uppercase text-lg font-semibold bg-gray-300 dark:bg-gray-500 dark:text-white"
								dayHeaderContent={(arg: { text: string }) => (
									<span className="uppercase text-lg font-semibold dark:text-white">
										{arg.text}
									</span>
								)}
								buttonText={{
									today: "Aujourd'hui",
									allDay: "Jour",
								}}
								headerToolbar={{
									left: "prev,next today",
									center: "title",
									right: "dayGridMonth,timeGridDay,timeGridWeek",
								}}
								views={{
									dayGridMonth: { buttonText: "Mois" },
									timeGridDay: {
										buttonText: "Jour",
										slotDuration: "00:45:00",
										slotMinTime: "08:00:00",
										slotMaxTime: "21:00:00",
										nowIndicator: true,
										scrollTime: "08:00:00",
									},
									timeGridWeek: {
										buttonText: "Semaine",
										slotDuration: "00:45:00",
										slotMinTime: "08:00:00",
										slotMaxTime: "21:00:00",
										nowIndicator: true,
										scrollTime: "08:00:00",
									},
								}}
								eventContent={(info: EventContentArg) => (
									<div className="p-1 text-sm bg-pink-400 text-white rounded">
										{info.event.title === "All-day"
											? "Jour"
											: info.event.title}
									</div>
								)}
								allDayText="Jour"
								nowIndicator={true}
								now={new Date()}
							/>
						</div>
					</div>
				</div>
				<AppointmentDialog
					open={isNewAppointmentOpen}
					onOpenChange={setIsNewAppointmentOpen}
					patients={patients}
					selectedDate={selectedDate}
					selectedPatient={selectedPatient}
				/>
				{selectedAppointment && (
					<AppointmentDialog
						open={isEditAppointmentOpen}
						onOpenChange={setIsEditAppointmentOpen}
						patients={patients}
						selectedDate={selectedDate}
						appointment={selectedAppointment}
						mode="edit"
					/>
				)}
			</div>
		</div>
	);
}
