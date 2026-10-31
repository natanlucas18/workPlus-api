export class ExtraEarningResponseDto {
  id: string;
  workStationName: string;
  activityName: string;
  payPeriodName: string;
  description: string | null;
  employeeName: string;
  value: string;
  date: Date;
  addedBy: string;
}
