import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FacturesService } from './factures.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('factures')
export class FacturesController {
  constructor(private facturesService: FacturesService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.facturesService.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturesService.findOne(id);
  }

  @Post(':id/paiements')
  addPaiement(@Param('id') id: string, @Body() dto: CreatePaiementDto) {
    return this.facturesService.addPaiement(id, dto);
  }
}