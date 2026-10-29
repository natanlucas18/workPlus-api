import { PayPeriodStatus } from 'src/enums/pay-period-status.enum';

export class PayPeriodResponseDto {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: PayPeriodStatus;
}
