import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProduitsService } from './produits.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { CreateVarianteDto } from './dto/create-variante.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { VendeursService } from '../vendeurs/vendeurs.service';

@Controller('produits')
export class ProduitsController {
  constructor(
    private produitsService: ProduitsService,
    private vendeursService: VendeursService,
  ) {}

  @Get() findAll() { return this.produitsService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.produitsService.findOne(id); }
  @Get(':id/variantes') getVariantes(@Param('id') id: string) { return this.produitsService.getVariantes(id); }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateProduitDto) {
    const vendeur = await this.vendeursService.findByUserId(user.id);
    if (!vendeur) throw new Error('Vendeur introuvable');
    return this.produitsService.create(vendeur.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/variantes')
  createVariante(@Param('id') id: string, @Body() dto: CreateVarianteDto) {
    return this.produitsService.createVariante(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.produitsService.uploadImage(id, file);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateProduitDto>) {
    return this.produitsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('variantes/:varianteId/stock')
  updateStock(@Param('varianteId') varianteId: string, @Body('stock') stock: number) {
    return this.produitsService.updateStock(varianteId, stock);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id') remove(@Param('id') id: string) { return this.produitsService.remove(id); }
}