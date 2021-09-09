import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-resport';
import { Report } from './repot.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

// Make sure it is added to the providers of the module
@Injectable()
export class ReportsService {
  // we have to inject the repository
  // private makes sure this repository get assigned as a property to our class
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  // destructuring from estimateDto
  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return (
      this.repo
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        // take a look at the "make" column of every single row.
        //:make we dont enter raw string to avoid the sql injection
        .where('make=:make', { make: make })
        // second "where" would override the first one
        .andWhere('model=:model', { model: model })
        .andWhere('lng-:lng BETWEEN -5 and 5 ', { lng })
        .andWhere('lat-:lat BETWEEN -5 and 5 ', { lat })
        .andWhere('year-:year BETWEEN -3 and 3 ', { year })
        .andWhere('approved IS TRUE')
        // I cannot set mileage like above so I set parameters.orderby does not take second parameter as an argument
        .orderBy('ABS(mileage- :mileage)', 'DESC')
        .setParameters({ mileage })
        .limit(3)
        // .getRawMany()
        // we are getting only one because          .select('AVG(price)', 'price')

        .getRawOne()
    );
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    // when we save it repostitory will just extract the user.id
    return this.repo.save(report);
  }
  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne(id);
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }
}
