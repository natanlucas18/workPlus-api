import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/activities/entities/activity.entity';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { Company } from 'src/company/entities/company.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { ExtraEarning } from 'src/extra-earnings/entities/extra-earnings.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkStation } from 'src/work-stations/entities/work-station.entity';
import { Repository } from 'typeorm';
import { GetDashboardOverviewResponseDto } from './dtos/dashboard-overview.dto';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(WorkStation)
    private readonly workStationRepository: Repository<WorkStation>,
    @InjectRepository(ExtraEarning)
    private readonly extraEarningsRepository: Repository<ExtraEarning>,
  ) {}

  async getDashboardOverview(): Promise<
    ResponseDto<GetDashboardOverviewResponseDto>
  > {
    const [
      companiesCount,
      activeCompaniesCount,
      usersCount,
      activeUsersCount,
      employeesCount,
      activitiesCount,
      workStationsCount,
      extraEarningsCount,
    ] = await Promise.all([
      this.companyRepository.count(),
      this.companyRepository.count({
        where: {
          isActive: true,
        },
      }),
      this.userRepository.count(),
      this.userRepository.count({
        where: {
          isActive: true,
        },
      }),
      this.employeeRepository.count(),
      this.activityRepository.count(),
      this.workStationRepository.count(),
      this.extraEarningsRepository.count(),
    ]);

    return {
      data: {
        companies: {
          total: companiesCount,
          active: activeCompaniesCount,
          inactive: companiesCount - activeCompaniesCount,
        },
        users: {
          total: usersCount,
          active: activeUsersCount,
          inactive: usersCount - activeUsersCount,
        },
        employeesCount,
        activitiesCount,
        workStationsCount,
        extraEarningsCount,
      },
    };
  }
}
