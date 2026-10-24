export type JwtPayload = {
  sub: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
  companyName: string;
  iat: string;
  exp: number;
  aud: string;
  iss: string;
};
