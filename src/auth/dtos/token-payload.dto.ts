export class TokenPayloadDto {
  sub: string;
  name: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
