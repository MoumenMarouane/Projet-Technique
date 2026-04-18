import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeClient } from '@prisma/client';
export class CreateClientDto {
  @IsEnum(TypeClient) type: TypeClient;
  @IsString() @IsOptional() statut?: string;
}
