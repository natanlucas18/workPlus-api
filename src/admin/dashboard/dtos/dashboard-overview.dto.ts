export class GetDashboardOverviewResponseDto {
  companies: {
    total: number;
    active: number;
    inactive: number;
  };
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  employeesCount: number;
  activitiesCount: number;
  workStationsCount: number;
  extraEarningsCount: number;
}
