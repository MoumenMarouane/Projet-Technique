import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateStatutCommandeDto } from './dto/update-statut-commande.dto';
import { TypeCommande } from '@prisma/client';

@Injectable()
export class CommandesService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, dto: CreateCommandeDto) {
    const resolvedClientId = dto.clientId ?? clientId;

    // Vérifier stock et règle estUnique pour chaque ligne
    for (const ligne of dto.lignes) {
      const variante = await this.prisma.variante.findUnique({
        where: { id: ligne.varianteId },
        include: { items: { include: { attributOption: { include: { attributType: true } } } } },
      });
      if (!variante) throw new BadRequestException(`Variante ${ligne.varianteId} introuvable`);
      if (variante.stock < ligne.quantite) throw new BadRequestException(`Stock insuffisant pour la variante ${ligne.varianteId}`);

      const hasUnique = variante.items.some(i => i.attributOption.attributType.estUnique);
      if (hasUnique && ligne.quantite > 1) throw new BadRequestException('Quantité forcée à 1 pour ce produit (N° série)');
    }

    const commande = await this.prisma.commande.create({
      data: {
        clientId: resolvedClientId,
        vendeurId: dto.vendeurId,
        type: dto.type,
        lignes: { create: dto.lignes },  // lignes contient varianteId maintenant
      },
      include: { lignes: true },
    });

    // Décrémenter le stock de chaque variante
    for (const ligne of dto.lignes) {
      await this.prisma.variante.update({
        where: { id: ligne.varianteId },
        data: { stock: { decrement: ligne.quantite } },
      });
    }

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
    return this.prisma.commande.findMany({
      where: { ...(clientId && { clientId }), ...(vendeurId && { vendeurId }) },
      include: { lignes: { include: { variante: { include: { items: true } } } } },
    });
  }

  findOne(id: string) {
    return this.prisma.commande.findUnique({
      where: { id },
      include: {
        lignes: { include: { variante: { include: { items: { include: { attributOption: true } }, produit: true } } } },
        facture: true,
        ticket: true,
      },
    });
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