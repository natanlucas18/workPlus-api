export class TokenPayloadDto {
  sub: string;
  name: string;
  companyId: string;
  companyName: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
