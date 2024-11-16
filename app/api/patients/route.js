import { NextResponse } from "next/server";
import prisma from "@/components/lib/connect";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const fetchAll = searchParams.get("fetchAll") === "true";
		const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
		const pageSize = parseInt(searchParams.get("pageSize") || "15", 10);
		const search = searchParams.get("search") || "";
		const letter = searchParams.get("letter") || "";

		const whereCondition = {
			isDeceased: false,
			...(search && {
				OR: [
					{ name: { contains: search, mode: "insensitive" } },
					{ email: { contains: search, mode: "insensitive" } },
					{ phone: { contains: search } },
				],
			}),
			...(letter && {
				name: {
					startsWith: letter,
					mode: "insensitive",
				},
			}),
		};

		// Pour le sélecteur de rendez-vous, retourner une liste simplifiée
		if (fetchAll) {
			const patients = await prisma.patient.findMany({
				where: whereCondition,
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
				},
				orderBy: {
					name: "asc",
				},
			});
			return NextResponse.json(patients);
		}

		// Pour la liste paginée complète
		const [patients, totalCount] = await Promise.all([
			prisma.patient.findMany({
				where: whereCondition,
				skip: (page - 1) * pageSize,
				take: pageSize,
				orderBy: {
					name: "asc",
				},
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
					gender: true,
					birthDate: true,
					isDeceased: true,
				},
			}),
			prisma.patient.count({ where: whereCondition }),
		]);

		return NextResponse.json({
			patients,
			totalPatients: totalCount,
			totalPages: Math.ceil(totalCount / pageSize),
			currentPage: page,
			pageSize,
		});
	} catch (error) {
		console.error("Erreur lors de la récupération des patients:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la récupération des patients" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	const patientData = await request.json();

	try {
		// Formater les données du patient
		const formattedPatientData = {
			name: patientData.name || "",
			email: patientData.email || null,
			phone: patientData.phone || null,
			address: patientData.address || null,
			gender:
				patientData.gender === "Homme"
					? "Homme"
					: patientData.gender === "Femme"
					? "Femme"
					: null,
			maritalStatus: patientData.maritalStatus
				? patientData.maritalStatus.toUpperCase()
				: null,
			occupation: patientData.occupation || null,
			hasChildren: patientData.hasChildren === "true",
			childrenAges: Array.isArray(patientData.childrenAges)
				? patientData.childrenAges.map((age) => parseInt(age, 10))
				: [],
			physicalActivity: patientData.physicalActivity || null,
			isSmoker: patientData.isSmoker === "true",
			handedness:
				patientData.handedness === "Droitier"
					? "RIGHT"
					: patientData.handedness === "Gaucher"
					? "LEFT"
					: "AMBIDEXTROUS",
			contraception:
				patientData.contraception === "Préservatifs"
					? "CONDOM"
					: patientData.contraception || null,
			currentTreatment: patientData.currentTreatment || null,
			generalPractitioner: patientData.generalPractitioner || null,
			surgicalHistory: patientData.surgicalHistory || null,
			digestiveProblems: patientData.digestiveProblems || null,
			digestiveDoctorName: patientData.digestiveDoctorName || null,
			birthDate: patientData.birthDate
				? new Date(patientData.birthDate)
				: null,
			avatarUrl: patientData.avatarUrl || null,
			traumaHistory: patientData.traumaHistory || null,
			rheumatologicalHistory: patientData.rheumatologicalHistory || null,
			hasVisionCorrection: patientData.hasVisionCorrection === "true",
			ophtalmologistName: patientData.ophtalmologistName || null,
			entProblems: patientData.entProblems || null,
			entDoctorName: patientData.entDoctorName || null,
			hdlm: patientData.hdlm || null,
			isDeceased: patientData.isDeceased === "true",
			osteopath: {
				connect: {
					id: 1, // À remplacer par l'ID de l'ostéopathe connecté
				},
			},
			...(patientData.cabinetId
				? {
						cabinet: {
							connect: {
								id: parseInt(patientData.cabinetId),
							},
						},
				  }
				: {}),
		};

		const newPatient = await prisma.patient.create({
			data: formattedPatientData,
		});

		return NextResponse.json(newPatient, { status: 201 });
	} catch (error) {
		console.error("Error creating patient:", error);
		return NextResponse.json(
			{ error: "Could not create patient" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request) {
	const { searchParams } = new URL(request.url);
	const email = searchParams.get("email");

	if (!email) {
		return NextResponse.json(
			{ error: "Email is required" },
			{ status: 400 }
		);
	}

	try {
		const patient = await prisma.patient.findUnique({ where: { email } });
		if (!patient) {
			return NextResponse.json(
				{ error: "Patient not found" },
				{ status: 404 }
			);
		}

		await prisma.patient.delete({ where: { email } });
		return NextResponse.json(
			{ message: "Patient deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting patient:", error);
		return NextResponse.json(
			{ error: "Could not delete patient" },
			{ status: 500 }
		);
	}
}
