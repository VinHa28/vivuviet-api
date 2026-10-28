import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination } from './destination.entity.js';
import { DestinationStatus } from './destination-status.enum.js';

@Injectable()
export class DestinationService {
  constructor(
    @InjectRepository(Destination)
    private readonly destinations: Repository<Destination>,
  ) { }

  findAllPublished(): Promise<Destination[]> {
    return this.destinations.find({
      where: { status: DestinationStatus.PUBLISHED },
      order: { name: 'ASC' },
    });
  }

  async findPublishedBySlug(slug: string): Promise<Destination> {
    const destination = await this.destinations.findOne({
      where: { slug, status: DestinationStatus.PUBLISHED },
    });
    if (!destination)
      throw new NotFoundException(`Destination "${slug}" not found`);
    return destination;
  }
}