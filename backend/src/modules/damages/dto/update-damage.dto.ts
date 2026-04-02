import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDamageDto {
  @IsString()
  @IsNotEmpty()
  damageType: string;

  @IsString()
  @IsNotEmpty()
  severity: string;

  @IsString()
  @IsNotEmpty()
  damagePosition: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  repairMethod?: string;
}
