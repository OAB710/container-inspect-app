export const APP_NAME = 'Ứng dụng giám định container';

export const INSPECTION_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
} as const;

export const SEVERITY_OPTIONS = [
  {label: 'Thấp', value: 'low'},
  {label: 'Trung bình', value: 'medium'},
  {label: 'Cao', value: 'high'},
];
