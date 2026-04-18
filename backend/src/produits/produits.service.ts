import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { CaracValeurDto } from './dto/carac-valeur.dto';
@Injectable()
export class ProduitsService {
  constructor(private prisma: PrismaService) {}
  create(vendeurId: string, dto: CreateProduitDto) { return this.prisma.produit.create({ data: { vendeurId, ...dto } }); }
  findAll() { return this.prisma.produit.findMany({ include: { categorie: true, caracValeurs: { include: { caracType: true } } } }); }
  findOne(id: string) { return this.prisma.produit.findUnique({ where: { id }, include: { caracValeurs: { include: { caracType: true } }, vendeur: true } }); }
  findByVendeur(vendeurId: string) { return this.prisma.produit.findMany({ where: { vendeurId } }); }
  update(id: string, dto: Partial<CreateProduitDto>) { return this.prisma.produit.update({ where: { id }, data: dto }); }
  remove(id: string) { return this.prisma.produit.delete({ where: { id } }); }
  addCaracValeur(produitId: string, dto: CaracValeurDto) { return this.prisma.caracValeur.create({ data: { produitId, ...dto } }); }
}
