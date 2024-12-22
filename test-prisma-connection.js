const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testConnection() {
	try {
		const patients = await prisma.patient.findMany();
	} catch (error) {
		console.error("Erreur de connexion Prisma :", error);
	} finally {
		await prisma.$disconnect();
	}
}

testConnection();
