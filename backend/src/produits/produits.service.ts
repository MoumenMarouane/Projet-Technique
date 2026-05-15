import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { CreateVarianteDto } from './dto/create-variante.dto';

@Injectable()
export class ProduitsService {
  constructor(private prisma: PrismaService) {}

  create(vendeurId: string, dto: CreateProduitDto) {
    return this.prisma.produit.create({ data: { vendeurId, ...dto } });
  }

  findAll() {
    return this.prisma.produit.findMany({
      include: {
        categorie: true,
        variantes: { include: { items: { include: { attributOption: { include: { attributType: true } } } } } },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.produit.findUnique({
      where: { id },
      include: {
        vendeur: true,
        categorie: true,
        variantes: { include: { items: { include: { attributOption: { include: { attributType: true } } } } } },
      },
    });
  }

  findByVendeur(vendeurId: string) {
    return this.prisma.produit.findMany({
      where: { vendeurId },
      include: { variantes: true },
    });
  }

  update(id: string, dto: Partial<CreateProduitDto>) {
    return this.prisma.produit.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.produit.delete({ where: { id } });
  }

  // ── Variantes ──────────────────────────────────────────────

  async createVariante(produitId: string, dto: CreateVarianteDto) {
    // Vérifier si une option est de type unique → stock forcé à 1
    if (dto.attributOptionIds?.length) {
      const options = await this.prisma.attributOption.findMany({
        where: { id: { in: dto.attributOptionIds } },
        include: { attributType: true },
      });
      const hasUnique = options.some(o => o.attributType.estUnique);
      if (hasUnique && dto.stock > 1) {
        throw new BadRequestException('Ce produit contient un attribut unique (ex: N° série) — stock forcé à 1');
      }
      if (hasUnique) dto.stock = 1;
    }

    return this.prisma.variante.create({
      data: {
        produitId,
        stock: dto.stock,
        prixModif: dto.prixModif,
        items: {
          create: dto.attributOptionIds.map(id => ({ attributOptionId: id })),
        },
      },
      include: {
        items: { include: { attributOption: { include: { attributType: true } } } },
      },
    });
  }

  getVariantes(produitId: string) {
    return this.prisma.variante.findMany({
      where: { produitId },
      include: {
        items: { include: { attributOption: { include: { attributType: true } } } },
      },
    });
  }

  updateStock(varianteId: string, stock: number) {
    return this.prisma.variante.update({
      where: { id: varianteId },
      data: { stock },
    });
  }
}