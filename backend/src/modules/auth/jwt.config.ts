const DEFAULT_DEV_JWT_SECRET = 'dev-secret-change-this';
const DEFAULT_JWT_EXPIRES_IN = '1d';

const isProduction = process.env.NODE_ENV === 'production';

const resolvedSecret = process.env.JWT_SECRET || DEFAULT_DEV_JWT_SECRET;

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required when NODE_ENV=production');
}

export const jwtConfig = {
  secret: resolvedSecret,
  expiresIn: (process.env.JWT_EXPIRES_IN as any) || DEFAULT_JWT_EXPIRES_IN,
};
