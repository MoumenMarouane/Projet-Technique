// create-attribut-type.dto.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAttributTypeDto {
  @IsString()
  nom: string;

  @IsBoolean()
  @IsOptional()
  estUnique?: boolean; // true = N° série → quantité forcée à 1
}