import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}
  create(dto: CreateContactDto) { return this.prisma.contact.create({ data: dto }); }
  findAll(vendeurId?: string, clientId?: string) { return this.prisma.contact.findMany({ where: { ...(vendeurId && { vendeurId }), ...(clientId && { clientId }) } }); }
  update(id: string, dto: Partial<CreateContactDto>) { return this.prisma.contact.update({ where: { id }, data: dto }); }
  remove(id: string) { return this.prisma.contact.delete({ where: { id } }); }
}
