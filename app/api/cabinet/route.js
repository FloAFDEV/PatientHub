import { PrismaClient } from "@prisma/client";
import cache from "memory-cache";

const prisma = new PrismaClient();
const jsonHeaders = { "Content-Type": "application/json" };

function formatCabinetData(data) {
	return {
		name: data.name || "",
		address: data.address || "",
		phone: data.phone || null,
		osteopathId: data.osteopathId || null,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

// Méthode GET pour récupérer tous les cabinets ou un cabinet par ID avec le nombre de patients
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const id = parseInt(searchParams.get("id") || "");

	try {
		let cabinets;
		if (id) {
			const cachedCabinet = cache.get(`cabinet_${id}`);
			if (cachedCabinet) {
				return new Response(JSON.stringify(cachedCabinet), {
					status: 200,
					headers: jsonHeaders,
				});
			}

			// Requête pour un cabinet spécifique avec nombre de patients
			const cabinet = await prisma.cabinet.findUnique({
				where: { id },
				include: {
					osteopath: true,
					patients: true, // Inclut les patients
				},
			});

			if (cabinet) {
				// Ajout du nombre de patients au cabinet
				const cabinetWithPatientCount = {
					...cabinet,
					patientCount: cabinet.patients.length,
				};
				// Mise en cache
				cache.put(`cabinet_${id}`, cabinetWithPatientCount, 60000);
				return new Response(JSON.stringify(cabinetWithPatientCount), {
					status: 200,
					headers: jsonHeaders,
				});
			} else {
				return new Response(
					JSON.stringify({ error: "Cabinet not found" }),
					{ status: 404, headers: jsonHeaders }
				);
			}
		} else {
			const cachedCabinets = cache.get("all_cabinets");
			if (cachedCabinets)
				return new Response(JSON.stringify(cachedCabinets), {
					status: 200,
					headers: jsonHeaders,
				});

			// Requête pour tous les cabinets
			cabinets = await prisma.cabinet.findMany({
				include: {
					osteopath: true,
					patients: true, // Inclut les patients
				},
			});

			// Ajouter le nombre de patients pour chaque cabinet
			cabinets = cabinets.map((cabinet) => ({
				...cabinet,
				patientCount: cabinet.patients.length,
			}));

			cache.put("all_cabinets", cabinets, 60000);
			return new Response(JSON.stringify(cabinets), {
				status: 200,
				headers: jsonHeaders,
			});
		}
	} catch (error) {
		console.error("Error retrieving cabinets:", error);
		return new Response(
			JSON.stringify({ error: "Failed to retrieve cabinets" }),
			{ status: 500, headers: jsonHeaders }
		);
	}
}

// POST Method
export async function POST(request) {
	try {
		const cabinetData = await request.json();
		const formattedCabinetData = formatCabinetData(cabinetData);

		if (formattedCabinetData.osteopathId) {
			const osteopath = await prisma.osteopath.findUnique({
				where: { id: formattedCabinetData.osteopathId },
			});
			if (!osteopath)
				return new Response(
					JSON.stringify({ error: "Osteopath not found" }),
					{ status: 404, headers: jsonHeaders }
				);
		}

		const newCabinet = await prisma.cabinet.create({
			data: formattedCabinetData,
		});
		cache.del("all_cabinets");

		return new Response(JSON.stringify(newCabinet), {
			status: 201,
			headers: jsonHeaders,
		});
	} catch (error) {
		console.error("Error creating cabinet:", error);
		return new Response(
			JSON.stringify({ error: "Failed to create cabinet" }),
			{ status: 500, headers: jsonHeaders }
		);
	}
}

// PUT Method
export async function PUT(request) {
	try {
		const cabinetData = await request.json();
		const id = cabinetData.id;

		if (!id || isNaN(id))
			return new Response(
				JSON.stringify({ error: "Valid ID is required" }),
				{ status: 400, headers: jsonHeaders }
			);

		const updatedCabinet = await prisma.cabinet.update({
			where: { id },
			data: { ...formatCabinetData(cabinetData), updatedAt: new Date() },
		});
		cache.del("all_cabinets");
		cache.del(`cabinet_${id}`);

		return new Response(JSON.stringify(updatedCabinet), {
			status: 200,
			headers: jsonHeaders,
		});
	} catch (error) {
		console.error("Error updating cabinet:", error);
		return new Response(
			JSON.stringify({ error: "Failed to update cabinet" }),
			{ status: 500, headers: jsonHeaders }
		);
	}
}

// DELETE Method
export async function DELETE(request) {
	const { searchParams } = new URL(request.url);
	const id = parseInt(searchParams.get("id") || "");

	if (!id || isNaN(id))
		return new Response(JSON.stringify({ error: "Valid ID is required" }), {
			status: 400,
			headers: jsonHeaders,
		});

	try {
		await prisma.cabinet.delete({ where: { id } });
		cache.del("all_cabinets");
		cache.del(`cabinet_${id}`);

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error("Error deleting cabinet:", error);
		return new Response(
			JSON.stringify({ error: "Failed to delete cabinet" }),
			{ status: 500, headers: jsonHeaders }
		);
	}
}
