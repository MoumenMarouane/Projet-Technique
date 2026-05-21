import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { VendeursModule } from '../vendeurs/vendeurs.module';

@Module({
  imports: [VendeursModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}