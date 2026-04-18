import { IsString, IsOptional } from 'class-validator';
export class CreateEntrepriseDto {
  @IsString() raisonSociale: string;
  @IsString() @IsOptional() ice?: string;
  @IsString() @IsOptional() if_fiscal?: string;
  @IsString() @IsOptional() rc?: string;
  @IsString() @IsOptional() cnss?: string;
  @IsString() @IsOptional() patente?: string;
  @IsString() @IsOptional() vendeurId?: string;
  @IsString() @IsOptional() clientId?: string;
}
