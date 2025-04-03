// app/api/appointments/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../lib/connect";
import { getSession } from "../../../lib/session";

// 🔍 Récupération des rendez-vous pour une journée donnée
export async function GET(request: Request) {
	try {
		const session = await getSession();
		if (!session?.user?.osteopathId) {
			return NextResponse.json(
				{ error: "Non autorisé" },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const date = searchParams.get("date");

		const appointments = await prisma.appointment.findMany({
			where: {
				patient: {
					osteopathId: session.user.osteopathId,
				},
				date: {
					gte: new Date(`${date}T00:00:00`),
					lt: new Date(`${date}T23:59:59`),
				},
			},
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						phone: true,
						email: true,
					},
				},
			},
			orderBy: {
				date: "asc",
			},
		});

		return NextResponse.json(
			appointments.map((apt) => ({
				id: apt.id,
				date: apt.date.toISOString(),
				patientId: apt.patientId,
				patientName: `${apt.patient.firstName} ${apt.patient.lastName}`,
				patientPhone: apt.patient.phone,
				patientEmail: apt.patient.email,
				reason: apt.reason,
				status: apt.status,
			}))
		);
	} catch (error) {
		console.error("Erreur:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la récupération des rendez-vous" },
			{ status: 500 }
		);
	}
}

// ➕ Création d'un nouveau rendez-vous
export async function POST(request: Request) {
	try {
		const session = await getSession();
		if (!session?.user?.osteopathId) {
			return NextResponse.json(
				{ error: "Non autorisé" },
				{ status: 401 }
			);
		}

		const data = await request.json();
		const { patientId, date, time, reason } = data;

		// 🔐 Vérifier que le patient appartient à l'ostéopathe
		const patient = await prisma.patient.findFirst({
			where: {
				id: parseInt(patientId),
				osteopathId: session.user.osteopathId,
			},
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient non trouvé" },
				{ status: 404 }
			);
		}

		// 🕓 Construire l'objet Date avec l'heure sélectionnée
		const appointmentDate = new Date(date);
		const [hours, minutes] = time.split(":");
		appointmentDate.setHours(parseInt(hours), parseInt(minutes));

		// ⛔ Vérifier l'absence de doublon à cette heure
		const existingAppointment = await prisma.appointment.findFirst({
			where: {
				date: appointmentDate,
				patient: {
					osteopathId: session.user.osteopathId,
				},
				status: "SCHEDULED",
			},
		});

		if (existingAppointment) {
			return NextResponse.json(
				{ error: "Un rendez-vous existe déjà à cette heure" },
				{ status: 409 }
			);
		}

		// ✅ Créer le rendez-vous
		const appointment = await prisma.appointment.create({
			data: {
				date: appointmentDate,
				reason,
				status: "SCHEDULED",
				patientId: parseInt(patientId),
			},
			include: {
				patient: true,
			},
		});

		return NextResponse.json(appointment);
	} catch (error) {
		console.error("Erreur:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la création du rendez-vous" },
			{ status: 500 }
		);
	}
}

// 📝 Mise à jour d’un rendez-vous existant
export async function PATCH(request: Request) {
	try {
		const session = await getSession();
		if (!session?.user?.osteopathId) {
			return NextResponse.json(
				{ error: "Non autorisé" },
				{ status: 401 }
			);
		}

		const data = await request.json();
		const { id, date, time, reason, status } = data;

		const appointmentDate = new Date(date);
		const [hours, minutes] = time.split(":");
		appointmentDate.setHours(parseInt(hours), parseInt(minutes));

		const appointment = await prisma.appointment.update({
			where: { id },
			data: {
				date: appointmentDate,
				reason,
				status,
			},
		});

		return NextResponse.json(appointment);
	} catch (error) {
		console.error("Erreur:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la mise à jour du rendez-vous" },
			{ status: 500 }
		);
	}
}

// ❌ Suppression d’un rendez-vous
export async function DELETE(request: Request) {
	try {
		const session = await getSession();
		if (!session?.user?.osteopathId) {
			return NextResponse.json(
				{ error: "Non autorisé" },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json({ error: "ID manquant" }, { status: 400 });
		}

		await prisma.appointment.delete({
			where: { id: parseInt(id) },
		});

		return NextResponse.json({ message: "Rendez-vous supprimé" });
	} catch (error) {
		console.error("Erreur:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la suppression du rendez-vous" },
			{ status: 500 }
		);
	}
}
