import { IsString, IsNumber, IsOptional, IsInt } from 'class-validator';
export class CreateProduitDto {
  @IsString() categorieId: string;
  @IsString() nom: string;
  @IsString() @IsOptional() description?: string;
  @IsNumber() prixUnitaire: number;
  @IsInt() @IsOptional() stock?: number;
}
