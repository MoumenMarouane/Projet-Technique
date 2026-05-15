import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { CreateAttributTypeDto } from './dto/create-attribut-type.dto';
import { CreateAttributOptionDto } from './dto/create-attribut-option.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCategorieDto) {
    return this.prisma.categorie.create({ data: dto });
  }

  findAll() {
    return this.prisma.categorie.findMany({
      include: {
        attributTypes: { include: { options: true } },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.categorie.findUnique({
      where: { id },
      include: {
        attributTypes: { include: { options: true } },
      },
    });
  }

  update(id: string, dto: Partial<CreateCategorieDto>) {
    return this.prisma.categorie.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.categorie.delete({ where: { id } });
  }

  addAttributType(categorieId: string, dto: CreateAttributTypeDto) {
    return this.prisma.attributType.create({
      data: { categorieId, ...dto },
      include: { options: true },
    });
  }

  getAttributTypes(categorieId: string) {
    return this.prisma.attributType.findMany({
      where: { categorieId },
      include: { options: true },
    });
  }

  addAttributOption(attributTypeId: string, dto: CreateAttributOptionDto) {
    return this.prisma.attributOption.create({
      data: { attributTypeId, valeur: dto.valeur },
    });
  }

  getAttributOptions(attributTypeId: string) {
    return this.prisma.attributOption.findMany({
      where: { attributTypeId },
    });
  }
}