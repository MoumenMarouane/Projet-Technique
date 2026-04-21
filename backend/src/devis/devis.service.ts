import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateStatutDevisDto } from './dto/update-statut-devis.dto';

@Injectable()
export class DevisService {
  constructor(private prisma: PrismaService) {}

  create(clientId: string, dto: CreateDevisDto) {
    return this.prisma.devis.create({
      data: { clientId, vendeurId: dto.vendeurId, lignes: { create: dto.lignes } },
      include: { lignes: true },
    });
  }

  findAll(clientId?: string, vendeurId?: string) {
    return this.prisma.devis.findMany({
      where: {
        ...(clientId && { clientId }),
        ...(vendeurId && { vendeurId }),
      },
      include: { lignes: { include: { produit: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.devis.findUnique({
      where: { id },
      include: { lignes: { include: { produit: true } } },
    });
  }

  async updateStatut(id: string, dto: UpdateStatutDevisDto) {
    const devis = await this.prisma.devis.update({
      where: { id },
      data: { statut: dto.statut },
      include: { lignes: true },
    });

    if (dto.statut === 'ACCEPTE') {
      await this.prisma.commande.create({
        data: {
          clientId: devis.clientId,
          vendeurId: devis.vendeurId,
          type: 'NORMAL',
          lignes: {
            create: devis.lignes.map(l => ({
              produitId: l.produitId,
              quantite: l.quantite,
              prixUnitaireSnap: l.prixUnitaireSnap,
            })),
          },
        },
      });
    }

    return devis;
  }
}