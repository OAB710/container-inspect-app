export const APP_NAME = 'Container Inspect App';

export const INSPECTION_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
} as const;

export const SEVERITY_OPTIONS = [
  {label: 'Thấp', value: 'low'},
  {label: 'Trung bình', value: 'medium'},
  {label: 'Cao', value: 'high'},
];

export const DAMAGE_TYPE_OPTIONS = [
  {label: 'Móp méo', value: 'Móp méo'},
  {label: 'Trầy xước', value: 'Trầy xước'},
  {label: 'Rách', value: 'Rách'},
  {label: 'Thủng', value: 'Thủng'},
  {label: 'Gãy', value: 'Gãy'},
  {label: 'Cong vênh', value: 'Cong vênh'},
  {label: 'Biến dạng', value: 'Biến dạng'},
];
