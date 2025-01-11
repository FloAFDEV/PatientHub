import { PrismaClient } from "@prisma/client";
import cache from "memory-cache";

const prisma = new PrismaClient();
const jsonHeaders = { "Content-Type": "application/json" };

// Fonction de validation des données
function validateCabinetData(data) {
	const errors = [];

	if (
		!data.name ||
		typeof data.name !== "string" ||
		data.name.trim().length === 0
	) {
		errors.push("Name is required and must be a non-empty string.");
	}

	if (
		!data.address ||
		typeof data.address !== "string" ||
		data.address.trim().length === 0
	) {
		errors.push("Address is required and must be a non-empty string.");
	}

	if (data.phone && typeof data.phone !== "string") {
		errors.push("Phone must be a string if provided.");
	}

	if (
		data.osteopathId &&
		(!Number.isInteger(data.osteopathId) || data.osteopathId <= 0)
	) {
		errors.push("OsteopathId must be a positive integer if provided.");
	}

	return errors;
}

// Fonction pour formater les données
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

// GET Method
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const id = parseInt(searchParams.get("id") || "");
	const limit = parseInt(searchParams.get("limit") || "10");
	const offset = parseInt(searchParams.get("offset") || "0");

	try {
		if (id) {
			const cachedCabinet = cache.get(`cabinet_${id}`);
			if (cachedCabinet) {
				return new Response(JSON.stringify(cachedCabinet), {
					status: 200,
					headers: jsonHeaders,
				});
			}

			const cabinet = await prisma.cabinet.findUnique({
				where: { id },
				include: { osteopath: true, patients: true },
			});
			if (!cabinet) {
				return new Response(
					JSON.stringify({ error: "Cabinet not found" }),
					{ status: 404, headers: jsonHeaders }
				);
			}

			const cabinetWithCount = {
				...cabinet,
				patientCount: cabinet.patients.length,
			};
			cache.put(`cabinet_${id}`, cabinetWithCount, 60000);
			return new Response(JSON.stringify(cabinetWithCount), {
				status: 200,
				headers: jsonHeaders,
			});
		}

		const cachedCabinets = cache.get("all_cabinets");
		if (cachedCabinets) {
			return new Response(JSON.stringify(cachedCabinets), {
				status: 200,
				headers: jsonHeaders,
			});
		}

		const cabinets = await prisma.cabinet.findMany({
			take: limit,
			skip: offset,
			include: { osteopath: true, patients: true },
		});

		const cabinetsWithCount = cabinets.map((cabinet) => ({
			...cabinet,
			patientCount: cabinet.patients.length,
		}));
		cache.put("all_cabinets", cabinetsWithCount, 60000);
		return new Response(JSON.stringify(cabinetsWithCount), {
			status: 200,
			headers: jsonHeaders,
		});
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

		// Validation manuelle
		const validationErrors = validateCabinetData(cabinetData);
		if (validationErrors.length > 0) {
			return new Response(JSON.stringify({ errors: validationErrors }), {
				status: 400,
				headers: jsonHeaders,
			});
		}

		// Vérifiez l'existence de l'ostéopathe s'il est fourni
		if (cabinetData.osteopathId) {
			const osteopath = await prisma.osteopath.findUnique({
				where: { id: cabinetData.osteopathId },
			});
			if (!osteopath) {
				return new Response(
					JSON.stringify({ error: "Osteopath not found" }),
					{ status: 404, headers: jsonHeaders }
				);
			}
		}

		const newCabinet = await prisma.cabinet.create({
			data: formatCabinetData(cabinetData),
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

		// Validation manuelle
		const validationErrors = validateCabinetData(cabinetData);
		if (validationErrors.length > 0) {
			return new Response(JSON.stringify({ errors: validationErrors }), {
				status: 400,
				headers: jsonHeaders,
			});
		}

		if (!cabinetData.id || isNaN(cabinetData.id)) {
			return new Response(
				JSON.stringify({ error: "Valid ID is required" }),
				{ status: 400, headers: jsonHeaders }
			);
		}

		const updatedCabinet = await prisma.cabinet.update({
			where: { id: cabinetData.id },
			data: { ...formatCabinetData(cabinetData), updatedAt: new Date() },
		});
		cache.del("all_cabinets");
		cache.del(`cabinet_${cabinetData.id}`);

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

	if (!id || isNaN(id)) {
		return new Response(JSON.stringify({ error: "Valid ID is required" }), {
			status: 400,
			headers: jsonHeaders,
		});
	}

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
