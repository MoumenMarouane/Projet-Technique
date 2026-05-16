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
    where: { ...(clientId && { clientId }), ...(vendeurId && { vendeurId }) },
    include: {
      lignes: {
        include: {
          variante: {
            include: {
              items: {
                include: {
                  attributOption: {
                    include: { attributType: true }
                  }
                }
              }
            }
          }
        }
      }
    },
  });
}

  findOne(id: string) {
    return this.prisma.devis.findUnique({
      where: { id },
      include: { lignes: { include: { variante: { include: { items: { include: { attributOption: true } } } } } } },
    });
  }

async updateStatut(id: string, dto: UpdateStatutDevisDto) {
  console.log('updateStatut appelé:', id, dto.statut);
  
  const devis = await this.prisma.devis.findUnique({
    where: { id },
    include: { lignes: true },
  });

  console.log('Devis trouvé:', JSON.stringify(devis));

  if (!devis) throw new Error('Devis introuvable');

  await this.prisma.devis.update({
    where: { id },
    data: { statut: dto.statut },
  });

  if (dto.statut === 'ACCEPTE') {
    console.log('Création commande pour lignes:', JSON.stringify(devis.lignes));
    await this.prisma.commande.create({
      data: {
        clientId: devis.clientId,
        vendeurId: devis.vendeurId,
        type: 'NORMAL',
        lignes: {
          create: devis.lignes.map(l => ({
            varianteId: l.varianteId,
            quantite: l.quantite,
            prixUnitaireSnap: l.prixUnitaireSnap,
          })),
        },
      },
    });
    console.log('Commande créée avec succès');
  }

  return this.prisma.devis.findUnique({
    where: { id },
    include: { lignes: true },
  });
}
}