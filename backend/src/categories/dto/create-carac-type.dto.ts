import { IsString } from 'class-validator';
export class CreateCaracTypeDto {
  @IsString() nom: string;
}
