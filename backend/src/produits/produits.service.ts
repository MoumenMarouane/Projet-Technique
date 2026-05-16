import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { CreateVarianteDto } from './dto/create-variante.dto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class ProduitsService {
  private _supabase: any;

  constructor(private prisma: PrismaService) {}

  private get supabase() {
    if (!this._supabase) {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_KEY;
      if (!url || !key) throw new Error('SUPABASE_URL ou SUPABASE_SERVICE_KEY manquant');
      this._supabase = createClient(url, key);
    }
    return this._supabase;
  }

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

  async uploadImage(produitId: string, file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop();
    const fileName = `${produitId}-${Date.now()}.${ext}`;

    const { error } = await this.supabase.storage
      .from('produits-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw new Error(`Upload échoué : ${error.message}`);

    const { data } = this.supabase.storage
      .from('produits-images')
      .getPublicUrl(fileName);

    return this.prisma.produit.update({
      where: { id: produitId },
      data: { imageUrl: data.publicUrl },
    });
  }

  async createVariante(produitId: string, dto: CreateVarianteDto) {
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