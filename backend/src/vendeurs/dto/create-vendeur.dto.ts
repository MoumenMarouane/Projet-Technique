import { IsString, IsOptional } from 'class-validator';
export class CreateVendeurDto {
  @IsString() boutiqueNom: string;
  @IsString() @IsOptional() boutiqueDesc?: string;
}
