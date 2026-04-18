import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { CreateCaracTypeDto } from './dto/create-carac-type.dto';
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  create(dto: CreateCategorieDto) { return this.prisma.categorie.create({ data: dto }); }
  findAll() { return this.prisma.categorie.findMany({ include: { caracTypes: true } }); }
  findOne(id: string) { return this.prisma.categorie.findUnique({ where: { id }, include: { caracTypes: true } }); }
  update(id: string, dto: Partial<CreateCategorieDto>) { return this.prisma.categorie.update({ where: { id }, data: dto }); }
  remove(id: string) { return this.prisma.categorie.delete({ where: { id } }); }
  addCaracType(categorieId: string, dto: CreateCaracTypeDto) { return this.prisma.caracType.create({ data: { categorieId, ...dto } }); }
}
