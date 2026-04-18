import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdressesService } from './adresses.service';
import { CreateAdresseDto } from './dto/create-adresse.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('adresses')
export class AdressesController {
  constructor(private adressesService: AdressesService) {}
  @Post() create(@Body() dto: CreateAdresseDto) { return this.adressesService.create(dto); }
  @Get() findAll() { return this.adressesService.findAll(); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateAdresseDto>) { return this.adressesService.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.adressesService.remove(id); }
}
