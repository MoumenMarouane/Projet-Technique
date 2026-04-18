import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  async getStats(vendeurId: string) {
    const [totalCommandes, totalProduits, commandes, factures] = await Promise.all([
      this.prisma.commande.count({ where: { vendeurId } }),
      this.prisma.produit.count({ where: { vendeurId } }),
      this.prisma.commande.findMany({ where: { vendeurId }, orderBy: { dateCommande: 'desc' }, take: 5, include: { lignes: true } }),
      this.prisma.facture.findMany({ where: { commande: { vendeurId } }, include: { paiements: true } }),
    ]);
    const chiffreAffaires = factures.reduce((sum, f) => sum + Number(f.montantTtc), 0);
    return { totalCommandes, totalProduits, chiffreAffaires, commandesRecentes: commandes };
  }
}
