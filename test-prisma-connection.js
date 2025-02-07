// testConnection.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testConnection() {
	try {
		const patients = await prisma.patient.findMany();
		// console.log("Patients:", patients);
	} catch (error) {
		console.error("Erreur de connexion Prisma :", error);
	} finally {
		await prisma.$disconnect();
	}
}

testConnection();
