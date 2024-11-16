import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const searchTerm = searchParams.get("term");

		const whereCondition = searchTerm
			? {
					OR: [
						{ name: { contains: searchTerm, mode: "insensitive" } },
						{
							email: {
								contains: searchTerm,
								mode: "insensitive",
							},
						},
						{ phone: { contains: searchTerm } },
					],
			  }
			: {};

		const patients = await prisma.patient.findMany({
			where: whereCondition,
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json({ patients });
	} catch (error) {
		console.error("Error retrieving patients:", error);
		return NextResponse.json(
			{ error: "Error retrieving patients" },
			{ status: 500 }
		);
	}
}
