import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateStatutCommandeDto } from './dto/update-statut-commande.dto';
import { TypeCommande } from '@prisma/client';

@Injectable()
export class CommandesService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, dto: CreateCommandeDto) {
    const resolvedClientId = dto.clientId ?? clientId;
    const commande = await this.prisma.commande.create({
      data: { clientId: resolvedClientId, vendeurId: dto.vendeurId, type: dto.type, lignes: { create: dto.lignes } },
      include: { lignes: true },
    });
    if (dto.type === TypeCommande.ANONYME) {
      const montantTotal = commande.lignes.reduce(
        (sum, l) => sum + Number(l.prixUnitaireSnap) * l.quantite, 0
      );
      await this.prisma.ticket.create({
        data: { commandeId: commande.id, montantTotal },
      });
    }
    return this.prisma.commande.findUnique({
      where: { id: commande.id },
      include: { lignes: true, ticket: true },
    });
  }

  findAll(clientId?: string, vendeurId?: string) {
    return this.prisma.commande.findMany({ where: { ...(clientId && { clientId }), ...(vendeurId && { vendeurId }) }, include: { lignes: true } });
  }

  findOne(id: string) {
    return this.prisma.commande.findUnique({ where: { id }, include: { lignes: { include: { produit: true } }, facture: true, ticket: true } });
  }

  async updateStatut(id: string, dto: UpdateStatutCommandeDto) {
    const commande = await this.prisma.commande.update({
      where: { id },
      data: { statut: dto.statut },
      include: { lignes: true },
    });
    if (dto.statut === 'CONFIRMEE') {
      const montantHt = commande.lignes.reduce(
        (sum, l) => sum + Number(l.prixUnitaireSnap) * l.quantite, 0
      );
      const tva = 20;
      const montantTtc = montantHt * (1 + tva / 100);
      await this.prisma.facture.create({
        data: { commandeId: commande.id, montantHt, tva, montantTtc },
      });
    }
    return commande;
  }
}