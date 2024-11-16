import { NextResponse } from 'next/server';
import prisma from '@/components/lib/connect';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: parseInt(params.id) },
      data: { status: 'CANCELED' },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation du rendez-vous' },
      { status: 500 }
    );
  }
}