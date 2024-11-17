import { NextResponse } from "next/server";
import prisma from "@/componentslib/prisma";

export async function PUT(_request, { params }) {
	try {
		const appointment = await prisma.appointment.update({
			where: { id: parseInt(params.id) },
			data: { status: "CANCELED" },
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
