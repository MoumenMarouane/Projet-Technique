import { IsArray, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateVarianteDto {
  @IsArray()
  @IsString({ each: true })
  attributOptionIds: string[];

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsNumber()
  prixModif?: number;
}