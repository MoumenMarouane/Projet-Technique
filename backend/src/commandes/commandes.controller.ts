import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateStatutCommandeDto } from './dto/update-statut-commande.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
@UseGuards(JwtAuthGuard)
@Controller('commandes')
export class CommandesController {
  constructor(private commandesService: CommandesService) {}
  @Post() create(@CurrentUser() user: any, @Body() dto: CreateCommandeDto) { return this.commandesService.create(user.id, dto); }
  @Get() findAll(@CurrentUser() user: any) { return this.commandesService.findAll(user.id); }
  @Get(':id') findOne(@Param('id') id: string) { return this.commandesService.findOne(id); }
  @Patch(':id/statut') updateStatut(@Param('id') id: string, @Body() dto: UpdateStatutCommandeDto) { return this.commandesService.updateStatut(id, dto); }
}
