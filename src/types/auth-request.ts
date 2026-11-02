import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './jwt-payload';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: User & {
    tokenPayload?: JwtPayload;
  };
}
