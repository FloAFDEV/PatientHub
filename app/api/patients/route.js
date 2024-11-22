import { NextResponse } from "next/server";
import prisma from "@/lib/connect";

// Fonction pour formater les données du patient
function formatPatientData(data) {
	return {
		name: data.name || "",
		email: data.email || null,
		phone: data.phone || null,
		address: data.address || null,
		gender:
			data.gender === "Homme"
				? "Homme"
				: data.gender === "Femme"
				? "Femme"
				: null,
		maritalStatus: data.maritalStatus
			? data.maritalStatus.toUpperCase()
			: null,
		occupation: data.occupation || null,
		hasChildren: data.hasChildren === "true" ? "true" : "false",
		childrenAges: Array.isArray(data.childrenAges)
			? data.childrenAges.map((age) => parseInt(age, 10))
			: [],
		physicalActivity: data.physicalActivity || null,
		isSmoker: data.isSmoker === "true",
		handedness:
			data.handedness === "Droitier"
				? "RIGHT"
				: data.handedness === "Gaucher"
				? "LEFT"
				: "AMBIDEXTROUS",
		contraception:
			data.contraception === "Préservatifs"
				? "CONDOM"
				: data.contraception || null,
		currentTreatment: data.currentTreatment || null,
		generalPractitioner: data.generalPractitioner || null,
		surgicalHistory: data.surgicalHistory || null,
		digestiveProblems: data.digestiveProblems || null,
		digestiveDoctorName: data.digestiveDoctorName || null,
		birthDate: data.birthDate ? new Date(data.birthDate) : null,
		avatarUrl: data.avatarUrl || null,
		traumaHistory: data.traumaHistory || null,
		rheumatologicalHistory: data.rheumatologicalHistory || null,
		hasVisionCorrection: data.hasVisionCorrection === "true",
		ophtalmologistName: data.ophtalmologistName || null,
		entProblems: data.entProblems || null,
		entDoctorName: data.entDoctorName || null,
		hdlm: data.hdlm || null,
		isDeceased: data.isDeceased === "true",
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const fetchAll = searchParams.get("fetchAll") === "true";
		const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
		const pageSize = parseInt(searchParams.get("pageSize") || "15", 10);
		const searchTerm =
			searchParams.get("search") || searchParams.get("term") || "";
		const letter = searchParams.get("letter") || "";

		const whereCondition = {
			...(searchTerm && {
				OR: [
					{ name: { contains: searchTerm, mode: "insensitive" } },
					{ email: { contains: searchTerm, mode: "insensitive" } },
					{ phone: { contains: searchTerm } },
				],
			}),
			...(letter && {
				name: {
					startsWith: letter,
					mode: "insensitive",
				},
			}),
		};

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

		const [patients, totalCount] = await Promise.all([
			prisma.patient.findMany({
				where: whereCondition,
				skip: (page - 1) * pageSize,
				take: pageSize,
				orderBy: {
					name: "asc",
				},
				include: {
					osteopath: true,
					cabinet: true,
					medicalDocuments: true,
					consultations: true,
					appointments: true,
				},
			}),
			prisma.patient.count({ where: whereCondition }),
		]);

		return NextResponse.json({
			patients: patients.map((patient) => ({
				...patient,
				birthDate: patient.birthDate
					? patient.birthDate.toISOString()
					: null,
				createdAt: patient.createdAt.toISOString(),
				updatedAt: patient.updatedAt.toISOString(),
			})),
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
		const formattedPatientData = formatPatientData(patientData);
		// Valeur d'ostéopathe, ici elle est en dur pour tester
		const osteopathId = 1;
		if (!osteopathId) {
			return new Response("Osteopath ID is required", { status: 400 });
		}
		// Connexion de l'ostéopathe à la donnée du patient
		formattedPatientData.osteopath = {
			connect: {
				id: osteopathId,
			},
		};
		// Vérification de l'ID du cabinet si fourni
		if (patientData.cabinetId) {
			const cabinetExists = await prisma.cabinet.findUnique({
				where: { id: parseInt(patientData.cabinetId) },
			});
			if (!cabinetExists) {
				return new Response("Cabinet not found", { status: 404 });
			}
			formattedPatientData.cabinet = {
				connect: {
					id: patientData.cabinetId,
				},
			};
		}
		// Traitement de `hasChildren` : Conversion en booléen si nécessaire
		if (patientData.hasChildren === "true") {
			formattedPatientData.hasChildren = true;
		} else if (patientData.hasChildren === "false") {
			formattedPatientData.hasChildren = false;
		}
		// Vérification des âges des enfants si `hasChildren` est vrai
		if (
			patientData.hasChildren === "true" &&
			Array.isArray(patientData.childrenAges)
		) {
			formattedPatientData.childrenAges = patientData.childrenAges.map(
				(age) => parseInt(age, 10)
			);
		}
		// Création d'un nouveau patient dans la base de données avec Prisma
		const newPatient = await prisma.patient.create({
			data: formattedPatientData,
		});
		// Retourner la réponse de création avec les données du patient
		return new Response(JSON.stringify(newPatient), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error creating patient:", error);
		return new Response(
			JSON.stringify({
				message: "Could not create patient",
				error: error.message,
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}

export async function DELETE(request) {
	try {
		const { searchParams } = new URL(request.url);
		const email = searchParams.get("email");

		if (!email) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		const patient = await prisma.patient.findUnique({
			where: { email },
			include: {
				osteopath: true,
				cabinet: true,
				medicalDocuments: true,
				consultations: true,
				appointments: true,
			},
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient not found" },
				{ status: 404 }
			);
		}

		await prisma.patient.delete({ where: { email } });

		return NextResponse.json(
			{ message: "Patient deleted successfully", patient },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting patient:", error);
		return NextResponse.json(
			{ error: "Could not delete patient", details: error.message },
			{ status: 500 }
		);
	}
}
