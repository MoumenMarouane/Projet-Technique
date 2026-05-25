import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  generer(commandeId: string, montantTotal: number) {
    return this.prisma.ticket.create({ data: { commandeId, montantTotal } });
  }

  findAll() {
    return this.prisma.ticket.findMany({
      include: { commande: true },
      orderBy: { dateEmission: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: { commande: true },
    });
  }

  findByCommande(commandeId: string) {
    return this.prisma.ticket.findUnique({ where: { commandeId } });
  }
}