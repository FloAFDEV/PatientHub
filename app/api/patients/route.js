import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const fetchAll = searchParams.get("fetchAll") === "true";
		const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
		const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
		const searchTerm =
			searchParams.get("search") || searchParams.get("term") || "";
		const letter = searchParams.get("letter") || "";

		const normalizedLetter = letter
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toUpperCase();

		let whereCondition = {};

		if (searchTerm) {
			whereCondition.OR = [
				{ firstName: { contains: searchTerm, mode: "insensitive" } },
				{ lastName: { contains: searchTerm, mode: "insensitive" } },
				{ email: { contains: searchTerm, mode: "insensitive" } },
				{ phone: { contains: searchTerm } },
			];
		} else if (normalizedLetter) {
			whereCondition.lastName = {
				startsWith: normalizedLetter,
				mode: "insensitive",
			};
		}

		if (fetchAll) {
			const patients = await prisma.patient.findMany({
				where: whereCondition,
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					phone: true,
					osteopathId: true,
					osteopath: { select: { name: true } },
				},
				orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
			});

			return NextResponse.json(patients, {
				headers: {
					"Cache-Control":
						"no-store, no-cache, must-revalidate, proxy-revalidate",
					Pragma: "no-cache",
					Expires: "0",
				},
			});
		} else {
			const [patients, totalCount] = await Promise.all([
				prisma.patient.findMany({
					where: whereCondition,
					skip: (page - 1) * pageSize,
					take: pageSize,
					orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
					include: {
						osteopath: { select: { id: true, name: true } },
						cabinet: true,
						medicalDocuments: true,
						consultations: true,
						appointments: true,
					},
				}),
				prisma.patient.count({ where: whereCondition }),
			]);

			const formattedPatients = patients.map((patient) => ({
				...patient,
				birthDate: patient.birthDate
					? patient.birthDate.toISOString()
					: null,
				createdAt: patient.createdAt.toISOString(),
				updatedAt: patient.updatedAt.toISOString(),
			}));

			return NextResponse.json(
				{
					patients: formattedPatients,
					totalPatients: totalCount,
					totalPages: Math.ceil(totalCount / pageSize),
					currentPage: page,
					pageSize,
				},
				{
					headers: {
						"Cache-Control":
							"no-store, no-cache, must-revalidate, proxy-revalidate",
						Pragma: "no-cache",
						Expires: "0",
					},
				}
			);
		}
	} catch (error) {
		console.error("Erreur lors de la récupération des patients:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la récupération des patients" },
			{ status: 500 }
		);
	}
}

// Fonction de gestion des requêtes POST
export async function POST(request) {
	const patientData = await request.json();

	try {
		if (!patientData.firstName || !patientData.lastName) {
			console.log("Error: firstName or lastName missing");
			return new Response("Firstname and lastname are required", {
				status: 400,
			});
		}

		const formattedPatientData = formatPatientData(patientData);
		formattedPatientData.firstName = patientData.firstName;
		formattedPatientData.lastName = patientData.lastName;

		const osteopathId = patientData.osteopathId || 1;
		if (!osteopathId) {
			return new Response("Osteopath ID is required", { status: 400 });
		}

		const osteopathExists = await prisma.osteopath.findUnique({
			where: { id: osteopathId },
		});
		if (!osteopathExists) {
			return new Response("Osteopath not found", { status: 404 });
		}

		formattedPatientData.osteopath = { connect: { id: osteopathId } };

		if (patientData.cabinetId) {
			const cabinetExists = await prisma.cabinet.findUnique({
				where: { id: parseInt(patientData.cabinetId) },
			});
			if (!cabinetExists) {
				return new Response("Cabinet not found", { status: 404 });
			}
			formattedPatientData.cabinet = {
				connect: { id: patientData.cabinetId },
			};
		}

		if (patientData.hasChildren === "true") {
			formattedPatientData.hasChildren = true;
		} else if (patientData.hasChildren === "false") {
			formattedPatientData.hasChildren = false;
		}

		const newPatient = await prisma.patient.create({
			data: formattedPatientData,
		});

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

// Fonction de gestion des requêtes DELETE
export async function DELETE(request) {
	try {
		const { searchParams } = new URL(request.url);
		const patientId = searchParams.get("id");

		if (!patientId || isNaN(patientId)) {
			return NextResponse.json(
				{ error: "ID is required and must be a valid number" },
				{ status: 400 }
			);
		}

		const patient = await prisma.patient.findUnique({
			where: { id: parseInt(patientId) },
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient not found" },
				{ status: 404 }
			);
		}

		console.log(
			`Patient found for deletion: ${patient.firstName} ${patient.lastName}, ID: ${patient.id}`
		);

		const deletedPatient = await prisma.$transaction(async (prisma) => {
			return await prisma.patient.delete({ where: { id: patient.id } });
		});

		console.log(
			`Patient successfully deleted: ${deletedPatient.firstName} ${deletedPatient.lastName}, ID: ${deletedPatient.id}`
		);
		cache.del("all_patients");

		return NextResponse.json(
			{ message: "Patient deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting patient:", error);
		return NextResponse.json(
			{
				error: "Could not delete patient",
				details: error.message || "An unexpected error occurred.",
			},
			{ status: 500 }
		);
	}
}

// Fonction de gestion des requêtes PATCH
export async function PATCH(request) {
	try {
		const patientData = await request.json();

		if (!patientData.id) {
			return NextResponse.json(
				{ error: "Patient ID is required" },
				{ status: 400 }
			);
		}

		const existingPatient = await prisma.patient.findUnique({
			where: { id: parseInt(patientData.id) },
			include: { osteopath: true },
		});

		if (!existingPatient) {
			return NextResponse.json(
				{ error: "Patient not found" },
				{ status: 404 }
			);
		}

		const updatedPatientData = {
			firstName: patientData.firstName || existingPatient.firstName,
			lastName: patientData.lastName || existingPatient.lastName,
			email: patientData.email || existingPatient.email,
			phone: patientData.phone || existingPatient.phone,
			address: patientData.address || existingPatient.address,
			gender: patientData.gender || existingPatient.gender,
			maritalStatus:
				patientData.maritalStatus || existingPatient.maritalStatus,
			occupation: patientData.occupation || existingPatient.occupation,
			hasChildren:
				patientData.hasChildren !== undefined
					? patientData.hasChildren
					: existingPatient.hasChildren,
			childrenAges:
				patientData.childrenAges || existingPatient.childrenAges,
			physicalActivity:
				patientData.physicalActivity ||
				existingPatient.physicalActivity,
			isSmoker:
				patientData.isSmoker !== undefined
					? patientData.isSmoker
					: existingPatient.isSmoker,
			handedness: patientData.handedness || existingPatient.handedness,
			contraception:
				patientData.contraception || existingPatient.contraception,
			currentTreatment:
				patientData.currentTreatment ||
				existingPatient.currentTreatment,
			generalPractitioner:
				patientData.generalPractitioner ||
				existingPatient.generalPractitioner,
			surgicalHistory:
				patientData.surgicalHistory || existingPatient.surgicalHistory,
			digestiveProblems:
				patientData.digestiveProblems ||
				existingPatient.digestiveProblems,
			digestiveDoctorName:
				patientData.digestiveDoctorName ||
				existingPatient.digestiveDoctorName,
			birthDate: patientData.birthDate
				? new Date(patientData.birthDate).toISOString()
				: existingPatient.birthDate,
			avatarUrl: patientData.avatarUrl || existingPatient.avatarUrl,
			traumaHistory:
				patientData.traumaHistory || existingPatient.traumaHistory,
			rheumatologicalHistory:
				patientData.rheumatologicalHistory ||
				existingPatient.rheumatologicalHistory,
			hasVisionCorrection:
				patientData.hasVisionCorrection !== undefined
					? patientData.hasVisionCorrection
					: existingPatient.hasVisionCorrection,
			ophtalmologistName:
				patientData.ophtalmologistName ||
				existingPatient.ophtalmologistName,
			entProblems: patientData.entProblems || existingPatient.entProblems,
			entDoctorName:
				patientData.entDoctorName || existingPatient.entDoctorName,
			hdlm: patientData.hdlm || existingPatient.hdlm,
			isDeceased:
				patientData.isDeceased !== undefined
					? patientData.isDeceased === "true"
					: existingPatient.isDeceased,
		};

		if (patientData.osteopathId) {
			const osteopathExists = await prisma.osteopath.findUnique({
				where: { id: parseInt(patientData.osteopathId) },
			});

			if (!osteopathExists) {
				return NextResponse.json(
					{ error: "Osteopath not found" },
					{ status: 404 }
				);
			}
			updatedPatientData.osteopath = {
				connect: { id: parseInt(patientData.osteopathId) },
			};
		} else if (existingPatient.osteopath) {
			updatedPatientData.osteopath = {
				connect: { id: existingPatient.osteopath.id },
			};
		}

		const updatedPatient = await prisma.patient.update({
			where: { id: parseInt(patientData.id) },
			data: updatedPatientData,
			include: { osteopath: true },
		});

		return NextResponse.json(updatedPatient, { status: 200 });
	} catch (error) {
		console.error("Error updating patient:", error);
		return NextResponse.json(
			{ error: "Could not update patient", details: error.message },
			{ status: 500 }
		);
	}
}
