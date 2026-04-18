import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MethodePaiement } from '@prisma/client';
export class CreatePaiementDto {
  @IsEnum(MethodePaiement) methode: MethodePaiement;
  @IsNumber() montantVerse: number;
  @IsString() @IsOptional() reference?: string;
}
