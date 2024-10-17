import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/components/lib/prisma";
import { getServerSession } from "next-auth/next";
import authOptions from "@/pages/api/auth/[...nextauth]";

// Définition du type de session
type SessionType = {
	user: {
		osteopathId: string;
	};
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ message: "Non autorisé" });
	}

	const typedSession = session as SessionType;

	switch (req.method) {
		case "GET":
			return getPatients(req, res, typedSession);
		case "POST":
			return createPatient(req, res, typedSession);
		case "PUT":
			return updatePatient(req, res);
		case "DELETE":
			return deletePatient(req, res);
		default:
			res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
			res.status(405).end(`Méthode ${req.method} non autorisée`);
	}
}

async function getPatients(
	req: NextApiRequest,
	res: NextApiResponse,
	session: SessionType
) {
	try {
		const patients = await prisma.patient.findMany({
			where: {
				osteopathId: session.user.osteopathId,
			},
		});
		res.json(patients);
	} catch (error) {
		res.status(500).json({
			error: "Échec de la récupération des patients",
		});
	}
}

async function createPatient(
	req: NextApiRequest,
	res: NextApiResponse,
	session: SessionType
) {
	const {
		name,
		email,
		phone,
		birthDate,
		gender,
		address,
		avatarUrl,
		cabinetId,
	} = req.body;

	try {
		const newPatient = await prisma.patient.create({
			data: {
				name,
				email,
				phone,
				birthDate: new Date(birthDate),
				gender,
				address,
				avatarUrl,
				cabinetId,
				osteopathId: session.user.osteopathId,
			},
		});
		res.status(201).json(newPatient);
	} catch (error) {
		res.status(500).json({ error: "Échec de la création du patient" });
	}
}

async function updatePatient(req: NextApiRequest, res: NextApiResponse) {
	const { id, ...data } = req.body;

	try {
		const updatedPatient = await prisma.patient.update({
			where: { id },
			data: {
				...data,
				birthDate: data.birthDate
					? new Date(data.birthDate)
					: undefined,
			},
		});
		res.json(updatedPatient);
	} catch (error) {
		res.status(500).json({ error: "Échec de la mise à jour du patient" });
	}
}

async function deletePatient(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.body;

	try {
		await prisma.patient.delete({
			where: { id },
		});
		res.status(204).end();
	} catch (error) {
		res.status(500).json({ error: "Échec de la suppression du patient" });
	}
}
