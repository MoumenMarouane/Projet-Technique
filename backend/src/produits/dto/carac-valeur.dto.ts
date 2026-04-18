import { IsString } from 'class-validator';
export class CaracValeurDto {
  @IsString() caracTypeId: string;
  @IsString() valeur: string;
}
