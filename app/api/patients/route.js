// app/api/patients/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
	try {
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
	} catch (error) {
		console.error("Error retrieving patients:", error);
		return new Response("Could not retrieve patients", { status: 500 });
	}
}
