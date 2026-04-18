import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}
  create(userId: string | null, dto: CreateClientDto) { return this.prisma.client.create({ data: { userId, ...dto } }); }
  findByUserId(userId: string) { return this.prisma.client.findUnique({ where: { userId }, include: { adresses: true, contacts: true, entreprise: true } }); }
}
