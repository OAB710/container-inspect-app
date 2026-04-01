import {DamageItem} from '../inspection';

export type InspectionStackParamList = {
  InspectionListScreen: undefined;
  InspectionDetailScreen: {inspectionId?: number} | undefined;
  DamageFormScreen:
    | {
        damageIndex?: number;
        damageItem?: DamageItem;
        readonly?: boolean;
      }
    | undefined;
};
