import { IsString, IsOptional } from 'class-validator';
export class CreateAdresseDto {
  @IsString() rue: string;
  @IsString() ville: string;
  @IsString() codePostal: string;
  @IsString() @IsOptional() region?: string;
  @IsString() pays: string;
  @IsString() @IsOptional() vendeurId?: string;
  @IsString() @IsOptional() clientId?: string;
}
