import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DestinationStatus } from '../destination/destination-status.enum.js';
import { Province } from './province.entity.js';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinces: Repository<Province>,
  ) {}

  async findAllActive(): Promise<Province[]> {
    const list = await this.provinces
      .createQueryBuilder('province')
      .leftJoinAndSelect(
        'province.destinations',
        'destination',
        'destination.status = :status',
        { status: DestinationStatus.PUBLISHED },
      )
      .where('province.isActive = true')
      .orderBy('province.name', 'ASC')
      .getMany();
    return list;
  }

  async findActiveByCode(code: string): Promise<Province> {
    const province = await this.provinces
      .createQueryBuilder('province')
      .leftJoinAndSelect(
        'province.destinations',
        'destination',
        'destination.status = :status',
        { status: DestinationStatus.PUBLISHED },
      )
      .where('province.code = :code', { code })
      .andWhere('province.isActive = true')
      .orderBy('destination.name', 'ASC')
      .getOne();
    if (!province) throw new NotFoundException(`Province "${code}" not found`);
    return province;
  }
}
