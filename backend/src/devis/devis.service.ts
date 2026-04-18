import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateStatutDevisDto } from './dto/update-statut-devis.dto';
@Injectable()
export class DevisService {
  constructor(private prisma: PrismaService) {}
  create(clientId: string, dto: CreateDevisDto) {
    return this.prisma.devis.create({ data: { clientId, vendeurId: dto.vendeurId, lignes: { create: dto.lignes } }, include: { lignes: true } });
  }
  findAll(clientId?: string, vendeurId?: string) {
    return this.prisma.devis.findMany({ where: { ...(clientId && { clientId }), ...(vendeurId && { vendeurId }) }, include: { lignes: true } });
  }
  findOne(id: string) { return this.prisma.devis.findUnique({ where: { id }, include: { lignes: { include: { produit: true } } } }); }
  updateStatut(id: string, dto: UpdateStatutDevisDto) { return this.prisma.devis.update({ where: { id }, data: { statut: dto.statut } }); }
}
