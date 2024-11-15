import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
	try {
		// Récupération des patients depuis la base de données
		const patients = await prisma.patient.findMany({
			select: {
				createdAt: true, // date de création
				gender: true,
				birthDate: true,
			},
		});

		// Total des patients
		const totalPatients = patients.length;

		// Répartition homme/femme
		const maleCount = patients.filter((p) => p.gender === "Homme").length;
		const femaleCount = patients.filter((p) => p.gender === "Femme").length;

		// Calcul des âges
		const ages = patients.map((p) => {
			const birthDate = new Date(p.birthDate);
			const ageDifMs = Date.now() - birthDate.getTime();
			const ageDate = new Date(ageDifMs);
			return Math.abs(ageDate.getUTCFullYear() - 1970);
		});

		// Âge moyen
		const averageAge = ages.reduce((a, b) => a + b, 0) / ages.length;

		// Calcul de l'âge moyen par genre
		const maleAges = patients
			.filter((p) => p.gender === "Homme")
			.map((p) => {
				const birthDate = new Date(p.birthDate);
				const ageDifMs = Date.now() - birthDate.getTime();
				const ageDate = new Date(ageDifMs);
				return Math.abs(ageDate.getUTCFullYear() - 1970);
			});

		const femaleAges = patients
			.filter((p) => p.gender === "Femme")
			.map((p) => {
				const birthDate = new Date(p.birthDate);
				const ageDifMs = Date.now() - birthDate.getTime();
				const ageDate = new Date(ageDifMs);
				return Math.abs(ageDate.getUTCFullYear() - 1970);
			});

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

		// Retourner la réponse JSON avec les données calculées
		return NextResponse.json({
			totalPatients,
			maleCount,
			femaleCount,
			averageAge: Math.round(averageAge * 10) / 10, // Arrondi à 1 décimale
			averageAgeMale: Math.round(averageAgeMale * 10) / 10,
			averageAgeFemale: Math.round(averageAgeFemale * 10) / 10,
			newPatientsThisMonth,
			newPatientsThisYear,
		});
	} catch (error) {
		// En cas d'erreur
		console.error(
			"Erreur lors de la récupération des données du tableau de bord:",
			error
		);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
