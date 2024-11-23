import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
	try {
		// 1. Récupérer tous les patients
		const patients = await prisma.patient.findMany({
			where: {
				id: {
					gte: 1, // Filtrer pour les IDs valides
				},
			},
		});

		const totalPatients = patients.length;

		// 2. Compter hommes et femmes dans les résultats
		const maleCount = patients.filter((p) => p.gender === "Homme").length;
		const femaleCount = patients.filter((p) => p.gender === "Femme").length;

		console.log("Nombre total de patients:", totalPatients);
		console.log("Nombre total d'hommes:", maleCount);
		console.log("Nombre total de femmes:", femaleCount);

		const currentDate = new Date();

		// 3. Calculer l'âge moyen des patients
		const ages = patients.map(
			(p) =>
				currentDate.getFullYear() - new Date(p.birthDate).getFullYear()
		);

		const averageAge = ages.length
			? ages.reduce((a, b) => a + b, 0) / ages.length
			: 0;

		// 4. Calculer l'âge moyen des hommes et des femmes
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

		// 5. Calculer les patients créés ce mois-ci
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

		const newPatientsThisMonth = patients.filter((p) => {
			const patientCreatedAt = new Date(p.createdAt);
			return (
				patientCreatedAt >= startOfMonth &&
				patientCreatedAt <= endOfMonth
			);
		});

		// 6. Nombre de nouveaux patients cette année
		const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
		const newPatientsThisYear = patients.filter(
			(p) => new Date(p.createdAt) >= startOfYear
		).length;

		// 7. Croissance mensuelle
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

			const patientsThisMonth = patients.filter((p) => {
				const createdAt = new Date(p.createdAt);
				return createdAt >= startOfMonth && createdAt <= endOfMonth;
			}).length;

			monthlyGrowth.push({
				month: monthDate.toLocaleString("default", { month: "long" }),
				patients: cumulativePatients + patientsThisMonth,
				growthText: `+${patientsThisMonth} patients`,
			});

			cumulativePatients += patientsThisMonth;
		}

		return NextResponse.json({
			totalPatients,
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
