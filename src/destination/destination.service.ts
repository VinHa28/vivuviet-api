import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Destination } from './destination.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class DestinationService {
  constructor(
    @InjectRepository(Destination)
    private readonly destionations: Repository<Destination>,
  ) {}

  findAllActive(): Promise<Destination[]> {
    return this.destionations.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findActiveByCode(code: string): Promise<Destination> {
    const destination = await this.destionations.findOne({
      where: { code, isActive: true },
      relations: { images: true },
      order: { images: { sortOrder: 'ASC', id: 'ASC' } },
    });
    if (!destination)
      throw new NotFoundException(`Destination "${code}" not found`);
    return destination;
  }

  
}
