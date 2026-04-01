import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformSaveInspectionPipe implements PipeTransform {
  transform(value: any) {
    // Some clients may accidentally send JSON string body.
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        throw new BadRequestException('Invalid payload');
      }
    }

    // Validate basic structure
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Invalid payload');
    }

    // Handle both camelCase and snake_case field names
    const containerId = this.parseId(
      value.containerId || value.container_id,
      'containerId',
    );
    const surveyorId = this.parseId(
      value.surveyorId || value.surveyor_id,
      'surveyorId',
    );
    const inspectionCode =
      value.inspectionCode || value.inspection_code || '';
    const inspectionDate =
      value.inspectionDate || value.inspection_date || '';

    // Validate inspection fields
    if (typeof inspectionCode !== 'string' || !inspectionCode.trim()) {
      throw new BadRequestException('inspectionCode must be a non-empty string');
    }

    if (typeof inspectionDate !== 'string' || !inspectionDate.trim()) {
      throw new BadRequestException('inspectionDate must be a non-empty string');
    }

    // Validate damages array
    if (!Array.isArray(value.damages)) {
      throw new BadRequestException('damages must be an array');
    }

    if (value.damages.length === 0) {
      throw new BadRequestException('damages array cannot be empty');
    }

    const damages = value.damages.map((damage: any, index: number) => {
      if (!damage || typeof damage !== 'object') {
        throw new BadRequestException(`damages[${index}] must be an object`);
      }

      // Check for camelCase (after SnakeToCamelPipe conversion)
      const position = damage.damagePosition || damage.damage_position;
      const type = damage.damageType || damage.damage_type;
      const severity = damage.severity;
      const description = damage.description;
      const method = damage.repairMethod || damage.repair_method;

      if (typeof position !== 'string' || !position.trim()) {
        throw new BadRequestException(`damages[${index}].damagePosition is required`);
      }

      if (typeof type !== 'string' || !type.trim()) {
        throw new BadRequestException(`damages[${index}].damageType is required`);
      }

      if (typeof severity !== 'string' || !severity.trim()) {
        throw new BadRequestException(`damages[${index}].severity is required`);
      }

      if (typeof description !== 'string' || !description.trim()) {
        throw new BadRequestException(`damages[${index}].description is required`);
      }

      if (typeof method !== 'string' || !method.trim()) {
        throw new BadRequestException(`damages[${index}].repairMethod is required`);
      }

      // Handle images - can be string array (URLs) or image object array
      let images: string[] = [];
      if (Array.isArray(damage.images)) {
        images = damage.images
          .filter((img: any) => {
            // If it's a string (URL), include it
            if (typeof img === 'string') return true;
            // If it's an object with image_url (already uploaded), include it
            if (typeof img === 'object' && img.image_url) return true;
            // Skip local images not yet uploaded
            return false;
          })
          .map((img: any) => (typeof img === 'string' ? img : img.image_url));
      }

      // Return clean damage object - only include needed fields (camelCase because SnakeToCamelPipe runs first)
      return {
        damagePosition: damage.damagePosition?.trim() || damage.damage_position?.trim() || '',
        damageType: damage.damageType?.trim() || damage.damage_type?.trim() || '',
        severity: damage.severity?.trim() || '',
        description: damage.description?.trim() || '',
        repairMethod: damage.repairMethod?.trim() || damage.repair_method?.trim() || '',
        images,
      };
    });

    // Return cleaned payload
    return {
      id: value.id ? this.parseId(value.id, 'id') : null,
      containerId,
      surveyorId,
      inspectionCode: inspectionCode.trim(),
      inspectionDate: inspectionDate.trim(),
      result: (value.result || value.note)?.trim() || '',
      note: (value.note || value.note)?.trim() || '',
      damages,
    };
  }

  private parseId(value: any, fieldName: string): number {
    if (!value) {
      throw new BadRequestException(`${fieldName} is required`);
    }

    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (!Number.isInteger(num) || num <= 0) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }

    return num;
  }
}
