export class ResponseLoginDto {
  auth: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: 'supervisor' | 'rh' | 'manager' | 'super_admin';
  };
}
