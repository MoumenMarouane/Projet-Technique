import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { EntreprisesService } from './entreprises.service';
import { CreateEntrepriseDto } from './dto/create-entreprise.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('entreprises')
export class EntreprisesController {
  constructor(private entreprisesService: EntreprisesService) {}
  @Post() create(@Body() dto: CreateEntrepriseDto) { return this.entreprisesService.create(dto); }
  @Get(':id') findOne(@Param('id') id: string) { return this.entreprisesService.findOne(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateEntrepriseDto>) { return this.entreprisesService.update(id, dto); }
}
