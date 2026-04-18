import { IsString, IsArray, ValidateNested, IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
export class LigneDevisDto {
  @IsString() produitId: string;
  @IsInt() quantite: number;
  @IsNumber() prixUnitaireSnap: number;
}
export class CreateDevisDto {
  @IsString() vendeurId: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => LigneDevisDto) lignes: LigneDevisDto[];
}
