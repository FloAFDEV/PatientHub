import { NextResponse } from "next/server";
import prisma from "@/components/lib/connect";

import { getSession } from "@/lib/session";

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

		const updatedAppointment = await prisma.appointment.update({
			where: { id: parseInt(params.id) },
			data: { status: "CANCELED" },
			include: {
				patient: true,
			},
		});

		return NextResponse.json(updatedAppointment);
	} catch (error) {
		console.error("Erreur:", error);
		return NextResponse.json(
			{ error: "Erreur lors de l'annulation du rendez-vous" },
			{ status: 500 }
		);
	}
}
