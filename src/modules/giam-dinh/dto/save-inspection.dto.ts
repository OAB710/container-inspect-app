import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SaveDamageDto {
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

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  images: string[];
}

export class SaveInspectionDto {
  @IsInt()
  containerId: number;

  @IsInt()
  surveyorId: number;

  @IsString()
  @IsNotEmpty()
  inspectionCode: string;

  @IsString()
  @IsNotEmpty()
  inspectionDate: string;

  @IsOptional()
  @IsString()
  result?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveDamageDto)
  damages: SaveDamageDto[];
}