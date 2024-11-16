import { NextResponse } from "next/server";
import prisma from "../../../../components/lib/connect";

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const data = await request.json();
		const { patientId, date, time, reason } = data;

		const appointmentDate = new Date(date);
		const [hours, minutes] = time.split(":");
		appointmentDate.setHours(parseInt(hours), parseInt(minutes));

		const appointment = await prisma.appointment.update({
			where: { id: parseInt(params.id) },
			data: {
				date: appointmentDate,
				reason,
				patientId: parseInt(patientId),
			},
		});

		return NextResponse.json(appointment);
	} catch {
		return NextResponse.json(
			{ error: "Erreur lors de la modification du rendez-vous" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.appointment.delete({
			where: { id: parseInt(params.id) },
		});

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json(
			{ error: "Erreur lors de la suppression du rendez-vous" },
			{ status: 500 }
		);
	}
}
