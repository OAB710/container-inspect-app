import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateInspectionDto {
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
}