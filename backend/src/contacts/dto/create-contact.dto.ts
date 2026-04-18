import { IsString, IsOptional } from 'class-validator';
export class CreateContactDto {
  @IsString() nom: string;
  @IsString() prenom: string;
  @IsString() @IsOptional() telephone?: string;
  @IsString() @IsOptional() emailContact?: string;
  @IsString() @IsOptional() cin?: string;
  @IsString() @IsOptional() vendeurId?: string;
  @IsString() @IsOptional() clientId?: string;
}
