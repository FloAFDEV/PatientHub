import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
	try {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();

		// Récupérer tous les patients
		const patients = await prisma.patient.findMany({
			select: {
				id: true,
				gender: true,
				birthDate: true,
				createdAt: true,
				isDeceased: true,
			},
			where: { isDeceased: false },
			take: 5000,
		});

		// Calcul du nombre total de patients
		const totalPatients = patients.length;

		// Calcul des hommes, femmes et non spécifiés
		const maleCount = patients.filter((p) => p.gender === "Homme").length;
		const femaleCount = patients.filter((p) => p.gender === "Femme").length;
		const unspecifiedGenderCount = patients.filter((p) => !p.gender).length;

		// Calcul de l'âge moyen (en excluant les patients sans date de naissance)
		const ages = patients
			.filter((p) => p.birthDate)
			.map(
				(p) =>
					currentDate.getFullYear() -
					new Date(p.birthDate).getFullYear()
			);
		const averageAge =
			ages.length > 0
				? Math.round(
						(ages.reduce((a, b) => a + b, 0) / ages.length) * 10
				  ) / 10
				: 0;

		// Calcul des âges moyens pour hommes et femmes
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
				? Math.round(
						(maleAges.reduce((a, b) => a + b, 0) /
							maleAges.length) *
							10
				  ) / 10
				: 0;
		const averageAgeFemale =
			femaleAges.length > 0
				? Math.round(
						(femaleAges.reduce((a, b) => a + b, 0) /
							femaleAges.length) *
							10
				  ) / 10
				: 0;

		// Patients créés avant février 2024 (le premier mois du graphique)
		const startOfGraph = new Date("2024-02-01");
		const initialPatients = patients.filter(
			(p) => new Date(p.createdAt) < startOfGraph
		).length;

		// Calcul des patients créés dans les 30 derniers jours
		const thirtyDaysAgo = new Date(currentDate);
		thirtyDaysAgo.setDate(currentDate.getDate() - 30);

		// Nombre de patients créés durant les 30 derniers jours
		const newPatientsLast30Days = patients.filter(
			(p) => new Date(p.createdAt) >= thirtyDaysAgo
		).length;

		// Croissance mensuelle sur les 12 derniers mois
		const monthlyGrowth = [];
		let cumulativePatients = initialPatients; // Commence avec les patients existants avant février

		// Pour chaque mois des 12 derniers mois
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

			// Calcul des patients créés durant ce mois
			const patientsThisMonth = patients.filter((p) => {
				const createdAt = new Date(p.createdAt);
				return (
					createdAt >= startOfMonth &&
					createdAt < new Date(endOfMonth.getTime() + 1)
				);
			}).length;

			// Ajoute les nouveaux patients ce mois-ci à la croissance cumulée
			cumulativePatients += patientsThisMonth;

			// Ajoute les données du mois courant
			monthlyGrowth.push({
				month: monthDate.toLocaleString("fr-FR", { month: "long" }),
				patients: cumulativePatients, // Le nombre de patients total jusqu'à ce mois
				growthText: `+${patientsThisMonth} patients`,
			});
		}

		// Les rendez-vous d'aujourd'hui (si vous avez un modèle Appointment dans votre base de données)
		const today = new Date();
		const appointmentsToday = await prisma.appointment.count({
			where: {
				date: {
					gte: new Date(today.setHours(0, 0, 0, 0)),
					lt: new Date(today.setHours(23, 59, 59, 999)),
				},
			},
		});

		// Récupère le prochain rendez-vous (si vous avez un modèle Appointment dans votre base de données)
		const nextAppointment = await prisma.appointment.findFirst({
			where: {
				date: {
					gte: new Date(),
				},
			},
			orderBy: {
				date: "asc",
			},
		});

		// Calcul du nombre de patients à la fin de l'année précédente
		const patientsLastYearEnd = patients.filter(
			(p) => new Date(p.createdAt) < new Date(currentYear, 0, 1)
		).length;

		// Nouveaux patients cette année (déjà calculé)
		const newPatientsThisYear = patients.filter(
			(p) => new Date(p.createdAt).getFullYear() === currentYear
		).length;

		// Calcul du pourcentage de croissance annuel avec un chiffre après la virgule
		let annualGrowthPercentage = 0;
		if (patientsLastYearEnd > 0) {
			annualGrowthPercentage = (
				(newPatientsThisYear / patientsLastYearEnd) *
				100
			).toFixed(1);
		}

		// Calcul du pourcentage de croissance sur les 30 derniers jours.
		let thirtyDayGrowthPercentage = 0;
		const patients30DaysBefore = patients.filter(
			(p) => new Date(p.createdAt) < thirtyDaysAgo
		).length;

		if (patients30DaysBefore > 0) {
			thirtyDayGrowthPercentage = (
				(newPatientsLast30Days /
					(totalPatients - newPatientsLast30Days)) *
				100
			).toFixed(1);
		}

		return NextResponse.json({
			totalPatients,
			maleCount,
			newPatientsLast30Days,
			femaleCount,
			unspecifiedGenderCount,
			averageAge,
			averageAgeMale,
			averageAgeFemale,
			monthlyGrowth,
			newPatientsThisMonth: patients.filter((p) => {
				const createdAt = new Date(p.createdAt);
				return (
					createdAt.getMonth() === currentDate.getMonth() &&
					createdAt.getFullYear() === currentDate.getFullYear()
				);
			}).length,
			newPatientsThisYear,
			newPatientsLastYear: patients.filter(
				(p) => new Date(p.createdAt).getFullYear() === currentYear - 1
			).length,
			patientsLastYearEnd,
			annualGrowthPercentage,
			thirtyDayGrowthPercentage,
			appointmentsToday,
			nextAppointment: nextAppointment
				? nextAppointment.date.toISOString()
				: null,
		});
	} catch (error) {
		console.error("Erreur lors de la récupération des données :", error);
		return NextResponse.json(
			{ error: error.message, stack: error.stack },
			{ status: 500 }
		);
	}
}
