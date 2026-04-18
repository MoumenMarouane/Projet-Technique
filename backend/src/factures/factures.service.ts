import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';

@Injectable()
export class FacturesService {
  constructor(private prisma: PrismaService) {}

  generer(commandeId: string, montantHt: number, tva: number) {
    const montantTtc = montantHt * (1 + tva / 100);
    return this.prisma.facture.create({ data: { commandeId, montantHt, tva, montantTtc } });
  }

  findOne(id: string) {
    return this.prisma.facture.findUnique({ where: { id }, include: { paiements: true, commande: true } });
  }

  findByCommande(commandeId: string) {
    return this.prisma.facture.findUnique({ where: { commandeId }, include: { paiements: true } });
  }

  async addPaiement(factureId: string, dto: CreatePaiementDto) {
    const facture = await this.prisma.facture.findUnique({ where: { id: factureId }, include: { paiements: true } });
    if (!facture) throw new BadRequestException('Facture introuvable');
    const totalVerse = facture.paiements.reduce((sum, p) => sum + Number(p.montantVerse), 0);
    const reste = Number(facture.montantTtc) - totalVerse;
    if (dto.montantVerse > reste) throw new BadRequestException('Montant depasse le reste a payer: ' + reste);
    const paiement = await this.prisma.paiement.create({ data: { factureId, ...dto } });
    const nouveauTotal = totalVerse + dto.montantVerse;
    const statut = nouveauTotal >= Number(facture.montantTtc) ? 'SOLDE' : 'PARTIEL';
    await this.prisma.facture.update({ where: { id: factureId }, data: { statutPaiement: statut as any } });
    return paiement;
  }
}