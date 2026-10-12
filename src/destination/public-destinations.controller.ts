import { Controller, Get, Param } from '@nestjs/common';
import { DestinationService } from './destination.service.js';
import { DestinationDetailResponse } from './dto/destination-detail.response.js';
import { DestinationSummaryResponse } from './dto/destination-summary.response.js';

@Controller('destinations')
export class PublicDestinationsController {
  constructor(private readonly destinationService: DestinationService) {}

  @Get()
  async findAll(): Promise<DestinationSummaryResponse[]> {
    const destinations = await this.destinationService.findAllActive();
    return destinations.map((d) => DestinationSummaryResponse.from(d));
  }

  @Get(':code')
  async findOne(
    @Param('code') code: string,
  ): Promise<DestinationDetailResponse> {
    const destination = await this.destinationService.findActiveByCode(code);
    return DestinationDetailResponse.from(destination);
  }
}
