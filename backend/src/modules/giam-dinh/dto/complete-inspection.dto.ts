import { IsOptional, IsString } from 'class-validator';

export class CompleteInspectionDto {
  @IsOptional()
  @IsString()
  expectedUpdatedAt?: string;
}
