import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdresseDto } from './dto/create-adresse.dto';
@Injectable()
export class AdressesService {
  constructor(private prisma: PrismaService) {}
  create(dto: CreateAdresseDto) { return this.prisma.adresse.create({ data: dto }); }
  findAll(vendeurId?: string, clientId?: string) { return this.prisma.adresse.findMany({ where: { ...(vendeurId && { vendeurId }), ...(clientId && { clientId }) } }); }
  update(id: string, dto: Partial<CreateAdresseDto>) { return this.prisma.adresse.update({ where: { id }, data: dto }); }
  remove(id: string) { return this.prisma.adresse.delete({ where: { id } }); }
}
