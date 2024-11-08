import { PrismaClient } from "@prisma/client";
import cache from "memory-cache";

const prisma = new PrismaClient();
// Options pour les en-têtes JSON de réponse
const jsonHeaders = {
	"Content-Type": "application/json",
};

// Fonction pour formater les données du cabinet
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

// Méthode GET pour récupérer tous les cabinets ou un cabinet par ID
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const id = parseInt(searchParams.get("id") || "");

	// Vérifier si les données sont dans le cache
	if (id) {
		const cachedCabinet = cache.get(`cabinet_${id}`);
		if (cachedCabinet) {
			console.log("Récupération du cabinet depuis le cache");
			return new Response(JSON.stringify(cachedCabinet), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
	} else {
		const cachedCabinets = cache.get("all_cabinets");
		if (cachedCabinets) {
			console.log("Récupération des cabinets depuis le cache");
			return new Response(JSON.stringify(cachedCabinets), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
	}

	// Si pas de cache, effectuer la requête à la base de données
	try {
		let cabinets;
		if (id) {
			cabinets = await prisma.cabinet.findUnique({
				where: { id: id },
				include: {
					osteopath: true,
					patients: true,
				},
			});
			// Mettre en cache le cabinet
			cache.put(`cabinet_${id}`, cabinets, 60000); // Expiration après 1 minute
		} else {
			cabinets = await prisma.cabinet.findMany({
				include: {
					osteopath: true,
					patients: true,
				},
			});
			// Mettre en cache tous les cabinets
			cache.put("all_cabinets", cabinets, 60000); // Expiration après 1 minute
		}

		if (cabinets) {
			return new Response(JSON.stringify(cabinets), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			});
		} else {
			return new Response("Cabinet not found", { status: 404 });
		}
	} catch (error) {
		console.error("Error retrieving cabinets:", error);
		return new Response("Could not retrieve cabinets", { status: 500 });
	}
}

// Méthode POST pour créer un nouveau cabinet
export async function POST(request) {
	const cabinetData = await request.json();

	try {
		const formattedCabinetData = formatCabinetData(cabinetData);

		if (formattedCabinetData.osteopathId) {
			const osteopath = await prisma.osteopath.findUnique({
				where: { id: formattedCabinetData.osteopathId },
			});

			if (!osteopath) {
				return new Response(
					JSON.stringify({ error: "Osteopath not found" }),
					{ status: 404, headers: jsonHeaders }
				);
			}
		}

		const newCabinet = await prisma.cabinet.create({
			data: formattedCabinetData,
		});

		// Invalidation du cache après ajout
		cache.del("all_cabinets");

		return new Response(JSON.stringify(newCabinet), {
			status: 201,
			headers: jsonHeaders,
		});
	} catch (error) {
		console.error("Error creating cabinet:", error);
		return new Response(
			JSON.stringify({ error: "Could not create cabinet" }),
			{ status: 500, headers: jsonHeaders }
		);
	}
}

// Méthode PUT pour mettre à jour un cabinet par ID
export async function PUT(request) {
	const cabinetData = await request.json();
	const id = cabinetData.id;

	if (!id || Number.isNaN(id)) {
		return new Response(JSON.stringify({ error: "Valid ID is required" }), {
			status: 400,
			headers: jsonHeaders,
		});
	}

	try {
		const formattedCabinetData = formatCabinetData(cabinetData);

		const updatedCabinet = await prisma.cabinet.update({
			where: { id: id },
			data: {
				...formattedCabinetData,
				updatedAt: new Date(),
			},
		});

		// Invalidation du cache après mise à jour
		cache.del("all_cabinets");
		cache.del(`cabinet_${id}`);

		return new Response(JSON.stringify(updatedCabinet), {
			status: 200,
			headers: jsonHeaders,
		});
	} catch (error) {
		console.error("Error updating cabinet:", error);
		return new Response(
			JSON.stringify({ error: "Could not update cabinet" }),
			{ status: 500, headers: jsonHeaders }
		);
	}
}

// Méthode DELETE pour supprimer un cabinet par ID
export async function DELETE(request) {
	const { searchParams } = new URL(request.url);
	const id = parseInt(searchParams.get("id") || "");

	if (!id || Number.isNaN(id)) {
		return new Response(JSON.stringify({ error: "Valid ID is required" }), {
			status: 400,
			headers: jsonHeaders,
		});
	}

	try {
		await prisma.cabinet.delete({
			where: { id: id },
		});

		// Invalidation du cache après suppression
		cache.del("all_cabinets");
		cache.del(`cabinet_${id}`);

		return new Response(
			JSON.stringify({ message: "Cabinet deleted successfully" }),
			{
				status: 204,
				headers: jsonHeaders,
			}
		);
	} catch (error) {
		console.error("Error deleting cabinet:", error);
		return new Response(
			JSON.stringify({ error: "Could not delete cabinet" }),
			{ status: 500, headers: jsonHeaders }
		);
	}
}
