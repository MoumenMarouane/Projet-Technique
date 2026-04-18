import { IsString, IsOptional } from 'class-validator';
export class CreateCategorieDto {
  @IsString() libelle: string;
  @IsString() @IsOptional() description?: string;
}
