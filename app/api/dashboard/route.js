import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
	try {
		const totalPatientCount = await prisma.patient.count();

		const patients = await prisma.patient.findMany();

		const maleCount = await prisma.patient.count({
			where: { gender: "Homme" },
		});
		const femaleCount = await prisma.patient.count({
			where: { gender: "Femme" },
		});

		const currentDate = new Date();

		// Calculer le début et la fin du mois en fonction du fuseau horaire local
		const startOfMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			1,
			0,
			0,
			0
		);
		const endOfMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + 1,
			0,
			23,
			59,
			59
		);

		// Calculer l'âge moyen des patients
		const ages = patients.map(
			(p) =>
				currentDate.getFullYear() - new Date(p.birthDate).getFullYear()
		);

		const averageAge = ages.length
			? ages.reduce((a, b) => a + b, 0) / ages.length
			: 0;

		const maleAges = patients
			.filter((p) => p.gender === "Homme")
			.map(
				(p) =>
					currentDate.getFullYear() -
					new Date(p.birthDate).getFullYear()
			);
		const femaleAges = patients
			.filter((p) => p.gender === "Femme")
			.map(
				(p) =>
					currentDate.getFullYear() -
					new Date(p.birthDate).getFullYear()
			);

		const averageAgeMale = maleAges.length
			? maleAges.reduce((a, b) => a + b, 0) / maleAges.length
			: 0;
		const averageAgeFemale = femaleAges.length
			? femaleAges.reduce((a, b) => a + b, 0) / femaleAges.length
			: 0;

		const newPatientsThisMonth = patients.filter((p) => {
			const patientCreatedAt = new Date(p.createdAt); // Convertir la date de création du patient en objet Date
			return (
				patientCreatedAt >= startOfMonth &&
				patientCreatedAt <= endOfMonth
			);
		});

		// Définir startOfYear
		const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
		const newPatientsThisYear = patients.filter(
			(p) => new Date(p.createdAt) >= startOfYear
		).length;

		// Calculer la croissance mensuelle
		const monthlyGrowth = [];
		let cumulativePatients = 0;

		for (let i = 11; i >= 0; i--) {
			const monthDate = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth() - i,
				1
			);
			const startOfMonth = new Date(
				monthDate.getFullYear(),
				monthDate.getMonth(),
				1
			);
			const endOfMonth = new Date(
				monthDate.getFullYear(),
				monthDate.getMonth() + 1,
				0
			);

			const patientsThisMonth = await prisma.patient.count({
				where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
			});

			monthlyGrowth.push({
				month: monthDate.toLocaleString("default", { month: "long" }),
				patients: cumulativePatients + patientsThisMonth,
				growthText: `+${patientsThisMonth} patients`,
			});

			cumulativePatients += patientsThisMonth;
		}
		return NextResponse.json({
			totalPatients: totalPatientCount,
			maleCount,
			femaleCount,
			averageAge: Math.round(averageAge * 10) / 10,
			averageAgeMale: Math.round(averageAgeMale * 10) / 10,
			averageAgeFemale: Math.round(averageAgeFemale * 10) / 10,
			newPatientsThisMonth,
			newPatientsThisYear,
			monthlyGrowth,
		});
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des données du tableau de bord:",
			error
		);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
