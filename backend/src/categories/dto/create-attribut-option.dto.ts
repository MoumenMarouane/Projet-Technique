// create-attribut-option.dto.ts
import { IsString } from 'class-validator';

export class CreateAttributOptionDto {
  @IsString()
  valeur: string; // "Rouge", "39", "SN-ABC123"
}
