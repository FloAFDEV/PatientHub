import { NextResponse } from "next/server";
import prisma from "../../../components/lib/connect";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const date = searchParams.get("date");

		const appointments = await prisma.appointment.findMany({
			where: {
				date: {
					gte: new Date(date + "T00:00:00"),
					lt: new Date(date + "T23:59:59"),
				},
			},
			include: {
				patient: true,
			},
		});

		return NextResponse.json(
			appointments.map((apt) => ({
				id: apt.id,
				date: apt.date.toISOString(),
				patientId: apt.patientId,
				patientName: apt.patient.name,
				reason: apt.reason,
				status: apt.status,
			}))
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Erreur lors de la récupération des rendez-vous" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const data = await request.json();
		const { patientId, date, time, reason } = data;

		const appointmentDate = new Date(date);
		const [hours, minutes] = time.split(":");
		appointmentDate.setHours(parseInt(hours), parseInt(minutes));

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
		return NextResponse.json(
			{ error: "Erreur lors de la création du rendez-vous" },
			{ status: 500 }
		);
	}
}
