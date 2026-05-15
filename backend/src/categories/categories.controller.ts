import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { CreateAttributTypeDto } from './dto/create-attribut-type.dto';
import { CreateAttributOptionDto } from './dto/create-attribut-option.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get() findAll() { return this.categoriesService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.categoriesService.findOne(id); }

  @UseGuards(JwtAuthGuard)
  @Post() create(@Body() dto: CreateCategorieDto) { return this.categoriesService.create(dto); }

  @UseGuards(JwtAuthGuard)
  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateCategorieDto>) {
    return this.categoriesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id') remove(@Param('id') id: string) { return this.categoriesService.remove(id); }

  @UseGuards(JwtAuthGuard)
  @Post(':id/attributs')
  addAttributType(@Param('id') id: string, @Body() dto: CreateAttributTypeDto) {
    return this.categoriesService.addAttributType(id, dto);
  }

  @Get(':id/attributs')
  getAttributTypes(@Param('id') id: string) {
    return this.categoriesService.getAttributTypes(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('attributs/:attributTypeId/options')
  addAttributOption(@Param('attributTypeId') attributTypeId: string, @Body() dto: CreateAttributOptionDto) {
    return this.categoriesService.addAttributOption(attributTypeId, dto);
  }

  @Get('attributs/:attributTypeId/options')
  getAttributOptions(@Param('attributTypeId') attributTypeId: string) {
    return this.categoriesService.getAttributOptions(attributTypeId);
  }
}