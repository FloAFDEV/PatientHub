import { NextResponse } from "next/server";
import prisma from "/lib/connect.ts";
import { getSession } from "/lib/session.ts";

export async function PUT(_request, { params }) {
	try {
		const session = await getSession();
		if (!session?.user?.osteopathId) {
			return NextResponse.json(
				{ error: "Non autorisé" },
				{ status: 401 }
			);
		}

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

		const appointment = await prisma.appointment.update({
			where: { id: parseInt(params.id) },
			data: { status: "CANCELED" },
			include: {
				patient: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
					},
				},
			},
		});

		return NextResponse.json(appointment);
	} catch (error) {
		console.error("Erreur lors de l'annulation:", error);
		return NextResponse.json(
			{ error: "Erreur lors de l'annulation du rendez-vous" },
			{ status: 500 }
		);
	}
}
