import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
	try {
		const currentDate = new Date();

		// Récupérer tous les patients (vivants et décédés)
		const patients = await prisma.patient.findMany({
			select: {
				id: true,
				gender: true,
				birthDate: true,
				createdAt: true,
				isDeceased: true,
			},
		});

		// Calcul du nombre total de patients (vivants et décédés)
		const totalPatients = patients.length;

		// Filtrer les patients vivants et décédés
		const livingPatients = patients.filter(
			(patient) => !patient.isDeceased
		);
		const deceasedPatients = patients.filter(
			(patient) => patient.isDeceased
		);

		// Calcul des hommes, femmes et non spécifiés (par genre)
		const maleCount = patients.filter((p) => p.gender === "Homme").length;
		const femaleCount = patients.filter((p) => p.gender === "Femme").length;
		const unspecifiedGenderCount = patients.filter((p) => !p.gender).length;

		// Calcul de l'âge moyen (arrondi à 0.5 près)
		const ages = patients
			.filter((p) => p.birthDate)
			.map(
				(p) =>
					currentDate.getFullYear() -
					new Date(p.birthDate).getFullYear()
			);

		const averageAge =
			ages.length > 0
				? roundToNearestHalf(
						ages.reduce((a, b) => a + b, 0) / ages.length
				  )
				: 0;

		// Calcul des âges moyens pour hommes et femmes (arrondi à 0.5 près)
		const maleAges = patients
			.filter((p) => p.gender === "Homme" && p.birthDate)
			.map(
				(p) =>
					currentDate.getFullYear() -
					new Date(p.birthDate).getFullYear()
			);
		const femaleAges = patients
			.filter((p) => p.gender === "Femme" && p.birthDate)
			.map(
				(p) =>
					currentDate.getFullYear() -
					new Date(p.birthDate).getFullYear()
			);

		const averageAgeMale =
			maleAges.length > 0
				? roundToNearestHalf(
						maleAges.reduce((a, b) => a + b, 0) / maleAges.length
				  )
				: 0;
		const averageAgeFemale =
			femaleAges.length > 0
				? roundToNearestHalf(
						femaleAges.reduce((a, b) => a + b, 0) /
							femaleAges.length
				  )
				: 0;

		// Patients créés ce mois-ci
		const startOfMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			1
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
			const createdAt = new Date(p.createdAt);
			return createdAt >= startOfMonth && createdAt <= endOfMonth;
		}).length;

		// Patients créés cette année
		const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
		const newPatientsThisYear = patients.filter(
			(p) => new Date(p.createdAt) >= startOfYear
		).length;

		// Croissance mensuelle sur les 12 derniers mois
		const monthlyGrowth = [];
		let cumulativePatients = 0;

		// Initialiser les 12 mois précédents et calculer la croissance mensuelle
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

			const patientsThisMonth = patients.filter((p) => {
				const createdAt = new Date(p.createdAt);
				return createdAt >= startOfMonth && createdAt <= endOfMonth;
			}).length;

			cumulativePatients += patientsThisMonth;

			monthlyGrowth.push({
				month: monthDate.toLocaleString("default", { month: "long" }),
				patients: cumulativePatients,
				growthText: `+${patientsThisMonth} patients`,
			});
		}

		// Retourner les résultats sous forme de JSON
		return NextResponse.json({
			totalPatients,
			livingPatientsCount: livingPatients.length,
			deceasedPatientsCount: deceasedPatients.length,
			maleCount,
			femaleCount,
			unspecifiedGenderCount,
			averageAge,
			averageAgeMale,
			averageAgeFemale,
			newPatientsThisMonth,
			newPatientsThisYear,
			monthlyGrowth,
		});
	} catch (error) {
		console.error("Erreur lors de la récupération des données :", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

// Fonction pour arrondir à 0.5 près
function roundToNearestHalf(value) {
	return Math.round(value * 2) / 2;
}
