export type JwtPayload = {
  sub: string;
  name: string;
  email: string;
  role: string;
  iat: string;
  exp: number;
  aud: string;
  iss: string;
};
