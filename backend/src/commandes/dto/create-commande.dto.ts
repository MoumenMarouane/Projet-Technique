import { IsString, IsEnum, IsArray, ValidateNested, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeCommande } from '@prisma/client';
export class LigneCommandeDto {
  @IsString() produitId: string;
  @IsInt() quantite: number;
  @IsNumber() prixUnitaireSnap: number;
}
export class CreateCommandeDto {
  @IsString() vendeurId: string;
  @IsEnum(TypeCommande) type: TypeCommande;
  @IsArray() @ValidateNested({ each: true }) @Type(() => LigneCommandeDto) lignes: LigneCommandeDto[];
}
