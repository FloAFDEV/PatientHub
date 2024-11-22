import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
	try {
		// Comptage total des patients
		const totalPatientCount = await prisma.patient.count();

		// Récupérer tous les patients sans limitation ni sélection de colonnes
		const patients = await prisma.patient.findMany();

		// Nombre d'hommes et de femmes
		const maleCount = await prisma.patient.count({
			where: {
				gender: "Homme",
			},
		});

		const femaleCount = await prisma.patient.count({
			where: {
				gender: "Femme",
			},
		});

		// Calcul des âges
		const ages = patients.map((p) => {
			const birthDate = new Date(p.birthDate);
			const ageDifMs = Date.now() - birthDate.getTime();
			const ageDate = new Date(ageDifMs);
			return Math.abs(ageDate.getUTCFullYear() - 1900);
		});

		// Âge moyen global
		const averageAge = ages.length
			? ages.reduce((a, b) => a + b, 0) / ages.length
			: 0;

		// Calcul des âges moyens par genre
		const maleAges = patients
			.filter((p) => p.gender === "Homme")
			.map((p) => {
				const birthDate = new Date(p.birthDate);
				const ageDifMs = Date.now() - birthDate.getTime();
				const ageDate = new Date(ageDifMs);
				return Math.abs(ageDate.getUTCFullYear() - 1900);
			});

		const femaleAges = patients
			.filter((p) => p.gender === "Femme")
			.map((p) => {
				const birthDate = new Date(p.birthDate);
				const ageDifMs = Date.now() - birthDate.getTime();
				const ageDate = new Date(ageDifMs);
				return Math.abs(ageDate.getUTCFullYear() - 1900);
			});

		// Âge moyen par genre
		const averageAgeMale = maleAges.length
			? maleAges.reduce((a, b) => a + b, 0) / maleAges.length
			: 0;
		const averageAgeFemale = femaleAges.length
			? femaleAges.reduce((a, b) => a + b, 0) / femaleAges.length
			: 0;

		// Date actuelle
		const currentDate = new Date();

		// Filtrer les patients créés ce mois-ci
		const startOfMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			1
		);
		const newPatientsThisMonth = patients.filter(
			(p) => new Date(p.createdAt) >= startOfMonth
		).length;

		// Filtrer les patients créés cette année
		const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
		const newPatientsThisYear = patients.filter(
			(p) => new Date(p.createdAt) >= startOfYear
		).length;

		// Calcul du pourcentage de croissance mensuelle
		const monthlyGrowth = [];
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
				0,
				23,
				59,
				59
			);

			// Nombre de patients créés ce mois-ci
			const patientsThisMonth = await prisma.patient.count({
				where: {
					createdAt: {
						gte: startOfMonth,
						lte: endOfMonth,
					},
				},
			});

			// Nombre de patients créés le mois précédent
			const previousMonthStart = new Date(
				monthDate.getFullYear(),
				monthDate.getMonth() - 1,
				1
			);
			const previousMonthEnd = new Date(
				monthDate.getFullYear(),
				monthDate.getMonth(),
				0,
				23,
				59,
				59
			);

			const patientsLastMonth = await prisma.patient.count({
				where: {
					createdAt: {
						gte: previousMonthStart,
						lte: previousMonthEnd,
					},
				},
			});

			// Calcul de la croissance mensuelle
			const growth =
				patientsLastMonth === 0
					? 100
					: ((patientsThisMonth - patientsLastMonth) /
							patientsLastMonth) *
					  100;
			monthlyGrowth.push({
				month: monthDate.toLocaleString("default", { month: "long" }),
				growth: growth.toFixed(2),
			});
		}

		// Retourner la réponse JSON avec les données calculées
		return NextResponse.json({
			totalPatients: totalPatientCount, // Utilisation du comptage direct
			maleCount,
			femaleCount,
			averageAge: Math.round(averageAge * 10) / 10, // Arrondi à 1 décimale
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
