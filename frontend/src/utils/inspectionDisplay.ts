const SEVERITY_LABELS: Record<string, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
};

const INSPECTION_STATUS_LABELS: Record<string, string> = {
  draft: 'Nháp',
  completed: 'Đã hoàn tất',
};

const CONTAINER_STATUS_LABELS: Record<string, string> = {
  empty: 'Rỗng',
  available: 'Rỗng',
  in_use: 'Rỗng',
  inspection_pending: 'Rỗng',
  inspected: 'Đã giám định',
  damaged: 'Hư hỏng',
  maintenance: 'Bảo trì',
  reserved: 'Đã giữ chỗ',
};

const ROLE_LABELS: Record<string, string> = {
  surveyor: 'Người giám định',
  authenticated: 'Đã đăng nhập',
  admin: 'Giám đốc',
};

const normalizeKey = (value: string) => value.trim().toLowerCase();

export const formatSeverityLabel = (severity: string) => {
  const normalized = normalizeKey(severity);
  return SEVERITY_LABELS[normalized] || severity;
};

export const formatInspectionStatusLabel = (status: string) => {
  const normalized = normalizeKey(status);
  return INSPECTION_STATUS_LABELS[normalized] || status;
};

export const formatContainerStatusLabel = (status: string) => {
  const normalized = normalizeKey(status);
  return CONTAINER_STATUS_LABELS[normalized] || status;
};

export const formatRoleLabel = (role: string) => {
  const normalized = normalizeKey(role);
  return ROLE_LABELS[normalized] || role;
};
