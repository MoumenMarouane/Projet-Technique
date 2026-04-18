import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateStatutCommandeDto } from './dto/update-statut-commande.dto';
@Injectable()
export class CommandesService {
  constructor(private prisma: PrismaService) {}
  create(clientId: string, dto: CreateCommandeDto) {
    return this.prisma.commande.create({ data: { clientId, vendeurId: dto.vendeurId, type: dto.type, lignes: { create: dto.lignes } }, include: { lignes: true } });
  }
  findAll(clientId?: string, vendeurId?: string) {
    return this.prisma.commande.findMany({ where: { ...(clientId && { clientId }), ...(vendeurId && { vendeurId }) }, include: { lignes: true } });
  }
  findOne(id: string) { return this.prisma.commande.findUnique({ where: { id }, include: { lignes: { include: { produit: true } }, facture: true, ticket: true } }); }
  updateStatut(id: string, dto: UpdateStatutCommandeDto) { return this.prisma.commande.update({ where: { id }, data: { statut: dto.statut } }); }
}
