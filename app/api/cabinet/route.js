import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

	try {
		if (id) {
			const cabinet = await prisma.cabinet.findUnique({
				where: { id: id },
				include: {
					osteopath: true,
					patients: true,
				},
			});

			if (cabinet) {
				return new Response(JSON.stringify(cabinet), {
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				});
			} else {
				return new Response("Cabinet not found", { status: 404 });
			}
		} else {
			const cabinets = await prisma.cabinet.findMany({
				include: {
					osteopath: true,
					patients: true,
				},
			});
			return new Response(JSON.stringify(cabinets), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			});
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
				return new Response("Osteopath not found", { status: 404 });
			}
		}

		const newCabinet = await prisma.cabinet.create({
			data: formattedCabinetData,
		});

		return new Response(JSON.stringify(newCabinet), {
			status: 201,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error creating cabinet:", error);
		return new Response("Could not create cabinet", { status: 500 });
	}
}

// Méthode PUT pour mettre à jour un cabinet par ID
export async function PUT(request) {
	const cabinetData = await request.json();
	const id = cabinetData.id;

	if (!id) {
		return new Response("ID is required", { status: 400 });
	}

	try {
		const formattedCabinetData = formatCabinetData(cabinetData);

		const updatedCabinet = await prisma.cabinet.update({
			where: { id: id },
			data: {
				...formattedCabinetData,
				updatedAt: new Date(), // Update the timestamp
			},
		});
		return new Response(JSON.stringify(updatedCabinet), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error updating cabinet:", error);
		return new Response("Could not update cabinet", { status: 500 });
	}
}

// Méthode DELETE pour supprimer un cabinet par ID
export async function DELETE(request) {
	const { searchParams } = new URL(request.url);
	const id = parseInt(searchParams.get("id") || "");

	if (!id) {
		return new Response("ID is required", { status: 400 });
	}

	try {
		await prisma.cabinet.delete({
			where: { id: id },
		});
		return new Response("Cabinet deleted successfully", { status: 204 });
	} catch (error) {
		console.error("Error deleting cabinet:", error);
		return new Response("Could not delete cabinet", { status: 500 });
	}
}
