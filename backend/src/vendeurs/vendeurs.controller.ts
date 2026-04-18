import { Controller, Get, Post, Patch, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { VendeursService } from './vendeurs.service';
import { CreateVendeurDto } from './dto/create-vendeur.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('vendeurs')
export class VendeursController {
  constructor(private vendeursService: VendeursService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateVendeurDto) {
    return this.vendeursService.create(user.id, dto);
  }

  @Get('me')
  findMe(@CurrentUser() user: any) {
    return this.vendeursService.findByUserId(user.id);
  }

  @Patch('me')
  async update(@CurrentUser() user: any, @Body() dto: Partial<CreateVendeurDto>) {
    const v = await this.vendeursService.findByUserId(user.id);
    if (!v) throw new NotFoundException('Vendeur introuvable');
    return this.vendeursService.update(v.id, dto);
  }
}