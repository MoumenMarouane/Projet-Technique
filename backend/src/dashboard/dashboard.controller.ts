import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { VendeursService } from '../vendeurs/vendeurs.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    private dashboardService: DashboardService,
    private vendeursService: VendeursService,
  ) {}

  @Get('stats')
  async getStats(@CurrentUser() user: any) {
    const vendeur = await this.vendeursService.findByUserId(user.id);
    if (!vendeur) return { totalCommandes: 0, totalProduits: 0, chiffreAffaires: 0, commandesRecentes: [] };
    return this.dashboardService.getStats(vendeur.id);
  }
}