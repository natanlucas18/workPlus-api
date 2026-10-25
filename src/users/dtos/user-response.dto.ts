import { Company } from 'src/company/entities/company.entity';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  company: Pick<Company, 'id' | 'name'>;
}
