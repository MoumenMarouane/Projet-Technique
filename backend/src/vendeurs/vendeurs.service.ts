import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendeurDto } from './dto/create-vendeur.dto';
@Injectable()
export class VendeursService {
  constructor(private prisma: PrismaService) {}
  create(userId: string, dto: CreateVendeurDto) {
    return this.prisma.vendeur.create({ data: { userId, ...dto } });
  }
  findOne(id: string) {
    return this.prisma.vendeur.findUnique({ where: { id }, include: { adresses: true, contacts: true, entreprise: true } });
  }
  findByUserId(userId: string) {
    return this.prisma.vendeur.findUnique({ where: { userId } });
  }
  update(id: string, dto: Partial<CreateVendeurDto>) {
    return this.prisma.vendeur.update({ where: { id }, data: dto });
  }
  findAll() {
  return this.prisma.vendeur.findMany({
    include: { adresses: true, contacts: true, entreprise: true },
  });
}
}
