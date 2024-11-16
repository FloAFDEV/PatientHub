import { PrismaClient } from "@prisma/client";
import cache from "memory-cache";

const prisma = new PrismaClient();
const jsonHeaders = { "Content-Type": "application/json" };

// Fonction pour formater les données de rendez-vous
function formatAppointmentData(data) {
	return {
		date: new Date(data.date) || null,
		time: data.time || "",
		reason: data.reason || "",
		patientId: data.patientId || null,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

// Méthode GET pour récupérer tous les rendez-vous ou un rendez-vous par ID
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const id = parseInt(searchParams.get("id") || "");
	const page = parseInt(searchParams.get("page") || "1"); // Page actuelle (défaut : 1)
	const appointmentsPerPage = parseInt(
		searchParams.get("appointmentsPerPage") || "15"
	); // Nombre de rendez-vous par page (défaut : 15)

	try {
		let appointments;

		if (id) {
			const cachedAppointment = cache.get(`appointment_${id}`);
			if (cachedAppointment) {
				return new Response(JSON.stringify(cachedAppointment), {
					status: 200,
					headers: jsonHeaders,
				});
			}

			// Récupérer un rendez-vous spécifique par ID
			const appointment = await prisma.appointment.findUnique({
				where: { id },
				include: { patient: true }, // Inclut les informations du patient
			});

			if (appointment) {
				cache.put(`appointment_${id}`, appointment, 60000); // Mise en cache pour 1 minute
				return new Response(JSON.stringify(appointment), {
					status: 200,
					headers: jsonHeaders,
				});
			} else {
				return new Response(
					JSON.stringify({ error: "Appointment not found" }),
					{ status: 404, headers: jsonHeaders }
				);
			}
		} else {
			const cachedAppointments = cache.get("all_appointments");
			if (cachedAppointments)
				return new Response(JSON.stringify(cachedAppointments), {
					status: 200,
					headers: jsonHeaders,
				});

			// Récupérer tous les rendez-vous
			appointments = await prisma.appointment.findMany({
				include: { patient: true }, // Inclut les informations des patients
			});

			// Application de la pagination
			const startIndex = (page - 1) * appointmentsPerPage;
			const endIndex = startIndex + appointmentsPerPage;
			const paginatedAppointments = appointments.slice(
				startIndex,
				endIndex
			);

			cache.put("all_appointments", paginatedAppointments, 60000);
			return new Response(JSON.stringify(paginatedAppointments), {
				status: 200,
				headers: jsonHeaders,
			});
		}
	} catch (error) {
		console.error("Error retrieving appointments:", error);
		return new Response(
			JSON.stringify({ error: "Failed to retrieve appointments" }),
			{ status: 500, headers: jsonHeaders }
		);
	}
}

// POST Method pour créer un rendez-vous
export async function POST(request) {
	try {
		const appointmentData = await request.json();
		const formattedAppointmentData = formatAppointmentData(appointmentData);

		// Vérifiez que le patient existe
		if (formattedAppointmentData.patientId) {
			const patient = await prisma.patient.findUnique({
				where: { id: formattedAppointmentData.patientId },
			});
			if (!patient)
				return new Response(
					JSON.stringify({ error: "Patient not found" }),
					{ status: 404, headers: jsonHeaders }
				);
		}

		// Créer le nouveau rendez-vous
		const newAppointment = await prisma.appointment.create({
			data: formattedAppointmentData,
		});

		cache.del("all_appointments"); // Supprimer les rendez-vous en cache

		return new Response(JSON.stringify(newAppointment), {
			status: 201,
			headers: jsonHeaders,
		});
	} catch (error) {
		console.error("Error creating appointment:", error);
		return new Response(
			JSON.stringify({ error: "Failed to create appointment" }),
			{ status: 500, headers: jsonHeaders }
		);
	}
}

// PUT Method pour mettre à jour un rendez-vous
export async function PUT(request) {
	try {
		const appointmentData = await request.json();
		const id = appointmentData.id;

		if (!id || isNaN(id))
			return new Response(
				JSON.stringify({ error: "Valid ID is required" }),
				{ status: 400, headers: jsonHeaders }
			);

		const updatedAppointment = await prisma.appointment.update({
			where: { id },
			data: {
				...formatAppointmentData(appointmentData),
				updatedAt: new Date(),
			},
		});

		cache.del("all_appointments");
		cache.del(`appointment_${id}`);

		return new Response(JSON.stringify(updatedAppointment), {
			status: 200,
			headers: jsonHeaders,
		});
	} catch (error) {
		console.error("Error updating appointment:", error);
		return new Response(
			JSON.stringify({ error: "Failed to update appointment" }),
			{ status: 500, headers: jsonHeaders }
		);
	}
}

// DELETE Method pour supprimer un rendez-vous
export async function DELETE(request) {
	const { searchParams } = new URL(request.url);
	const id = parseInt(searchParams.get("id") || "");

	if (!id || isNaN(id))
		return new Response(JSON.stringify({ error: "Valid ID is required" }), {
			status: 400,
			headers: jsonHeaders,
		});

	try {
		await prisma.appointment.delete({ where: { id } });
		cache.del("all_appointments");
		cache.del(`appointment_${id}`);

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error("Error deleting appointment:", error);
		return new Response(
			JSON.stringify({ error: "Failed to delete appointment" }),
			{ status: 500, headers: jsonHeaders }
		);
	}
}
