import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET!,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  expiresIn: Number(process.env.JWT_TOKEN_EXPIRES_IN ?? 900),
  jwtRefreshTtl: Number(process.env.JWT_REFRESH_TTL ?? 86400),
}));
