import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { CreateCaracTypeDto } from './dto/create-carac-type.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}
  @Get() findAll() { return this.categoriesService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.categoriesService.findOne(id); }
  @UseGuards(JwtAuthGuard) @Post() create(@Body() dto: CreateCategorieDto) { return this.categoriesService.create(dto); }
  @UseGuards(JwtAuthGuard) @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateCategorieDto>) { return this.categoriesService.update(id, dto); }
  @UseGuards(JwtAuthGuard) @Delete(':id') remove(@Param('id') id: string) { return this.categoriesService.remove(id); }
  @UseGuards(JwtAuthGuard) @Post(':id/carac-types') addCaracType(@Param('id') id: string, @Body() dto: CreateCaracTypeDto) { return this.categoriesService.addCaracType(id, dto); }
}
