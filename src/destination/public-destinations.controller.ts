import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DestinationService } from './destination.service.js';
import { DestinationDetailResponse } from './dto/destination-detail.response.js';
import { DestinationSummaryResponse } from './dto/destination-summary.response.js';

@ApiTags('destinations')
@Controller('destinations')
export class PublicDestinationsController {
  constructor(private readonly destinationService: DestinationService) { }

  @Get()
  @ApiOkResponse({ type: DestinationSummaryResponse, isArray: true })
  async findAll(): Promise<DestinationSummaryResponse[]> {
    const destinations = await this.destinationService.findAllPublished();
    return destinations.map((d) => DestinationSummaryResponse.from(d));
  }

  @Get(':slug')
  @ApiOkResponse({ type: DestinationDetailResponse })
  @ApiNotFoundResponse({ description: 'Destination slug does not exist' })
  async findOne(
    @Param('slug') slug: string,
  ): Promise<DestinationDetailResponse> {
    const destination = await this.destinationService.findPublishedBySlug(slug);
    return DestinationDetailResponse.from(destination);
  }
}