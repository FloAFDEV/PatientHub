import { NextResponse } from "next/server";
import prisma from "../../../../lib/connect";
import { getSession } from "../../../../lib/session";

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
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

		// Vérifier que le rendez-vous appartient à l'ostéopathe
		const existingAppointment = await prisma.appointment.findFirst({
			where: {
				id: parseInt(params.id),
				patient: {
					osteopathId: session.user.osteopathId,
				},
			},
		});

		if (!existingAppointment) {
			return NextResponse.json(
				{ error: "Rendez-vous non trouvé" },
				{ status: 404 }
			);
		}

		const appointmentDate = new Date(date);
		const [hours, minutes] = time.split(":");
		appointmentDate.setHours(parseInt(hours), parseInt(minutes));

		// Vérifier les conflits d'horaire
		const conflictingAppointment = await prisma.appointment.findFirst({
			where: {
				id: { not: parseInt(params.id) },
				date: appointmentDate,
				patient: {
					osteopathId: session.user.osteopathId,
				},
				status: "SCHEDULED",
			},
		});

		if (conflictingAppointment) {
			return NextResponse.json(
				{ error: "Un autre rendez-vous existe déjà à cette heure" },
				{ status: 409 }
			);
		}

		const appointment = await prisma.appointment.update({
			where: { id: parseInt(params.id) },
			data: {
				date: appointmentDate,
				reason,
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
		const session = await getSession();
		if (!session?.user?.osteopathId) {
			return NextResponse.json(
				{ error: "Non autorisé" },
				{ status: 401 }
			);
		}

		// Vérifier que le rendez-vous appartient à l'ostéopathe
		const appointment = await prisma.appointment.findFirst({
			where: {
				id: parseInt(params.id),
				patient: {
					osteopathId: session.user.osteopathId,
				},
			},
		});

		if (!appointment) {
			return NextResponse.json(
				{ error: "Rendez-vous non trouvé" },
				{ status: 404 }
			);
		}

		await prisma.appointment.delete({
			where: { id: parseInt(params.id) },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Erreur:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la suppression du rendez-vous" },
			{ status: 500 }
		);
	}
}
