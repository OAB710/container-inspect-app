/**
 * Generate a unique inspection code
 * Format: GD-YYYYMMDD-XXXXXXXX where X is a random hex digit
 * Example: GD-20260401-a1b2c3d4
 */
export const generateInspectionCode = (): string => {
  const now = new Date();
  
  // Format: YYYYMMDD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Generate random hex string (8 characters)
  const randomHex = Array.from({ length: 8 })
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
  
  return `GD-${dateStr}-${randomHex}`;
};
