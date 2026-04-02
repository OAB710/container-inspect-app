import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveDamageDto {
  @IsString()
  @IsNotEmpty()
  damagePosition: string;

  @IsString()
  @IsNotEmpty()
  damageType: string;

  @IsString()
  @IsNotEmpty()
  severity: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  repairMethod: string;

  @IsArray()
  images: string[];
}

export class SaveInspectionDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  id?: number;

  @IsInt()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  containerId: number;

  @IsInt()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  surveyorId: number;

  @IsString()
  @IsNotEmpty()
  inspectionCode: string;

  @IsString()
  @IsNotEmpty()
  inspectionDate: string;

  @IsOptional()
  @IsString()
  expectedUpdatedAt?: string;

  @IsString()
  @IsOptional()
  result?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsArray()
  damages: SaveDamageDto[];
}
