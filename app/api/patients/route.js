import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Méthode GET pour récupérer tous les patients ou un patient par e-mail
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const email = searchParams.get("email");

	try {
		if (email) {
			const patient = await prisma.patient.findUnique({
				where: { email: email },
				include: {
					cabinet: true,
					osteopath: true,
				},
			});

			if (patient) {
				return new Response(JSON.stringify(patient), {
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				});
			} else {
				return new Response("Patient not found", { status: 404 });
			}
		} else {
			const patients = await prisma.patient.findMany({
				include: {
					cabinet: true,
					osteopath: true,
				},
			});
			return new Response(JSON.stringify(patients), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
	} catch (error) {
		console.error("Error retrieving patients:", error);
		return new Response("Could not retrieve patients", { status: 500 });
	}
}

// Méthode POST pour créer un nouveau patient
export async function POST(request) {
	const patientData = await request.json();

	try {
		const newPatient = await prisma.patient.create({
			data: {
				...patientData,
			},
		});
		return new Response(JSON.stringify(newPatient), {
			status: 201,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error creating patient:", error);
		return new Response("Could not create patient", { status: 500 });
	}
}

// Méthode PUT pour mettre à jour un patient par e-mail
export async function PUT(request) {
	const patientData = await request.json();
	const email = patientData.email; // Récupérer l'email pour identifier le patient

	if (!email) {
		return new Response("Email is required", { status: 400 });
	}

	try {
		const updatedPatient = await prisma.patient.update({
			where: { email: email },
			data: {
				...patientData,
			},
		});
		return new Response(JSON.stringify(updatedPatient), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error updating patient:", error);
		return new Response("Could not update patient", { status: 500 });
	}
}

// Méthode DELETE pour supprimer un patient par e-mail
export async function DELETE(request) {
	const { searchParams } = new URL(request.url);
	const email = searchParams.get("email");

	if (!email) {
		return new Response("Email is required", { status: 400 });
	}

	try {
		await prisma.patient.delete({
			where: { email: email },
		});
		return new Response("Patient deleted successfully", { status: 204 });
	} catch (error) {
		console.error("Error deleting patient:", error);
		return new Response("Could not delete patient", { status: 500 });
	}
}
