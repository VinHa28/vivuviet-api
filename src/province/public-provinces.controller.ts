import { Controller, Get, Param } from '@nestjs/common';
import { ProvinceService } from './province.service.js';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProvinceSummaryResponse } from './dto/province-summary.response.js';
import { ProvinceDetailResponse } from './dto/province-detail.response.js';

@ApiTags('provinces')
@Controller('provinces')
export class PublicProvincesController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  @ApiOkResponse({ type: ProvinceSummaryResponse, isArray: true })
  async findAll(): Promise<ProvinceSummaryResponse[]> {
    const provinces = await this.provinceService.findAllActive();
    return provinces.map((p) => ProvinceSummaryResponse.from(p));
  }

  @Get(':code')
  @ApiOkResponse({ type: ProvinceDetailResponse })
  @ApiNotFoundResponse({
    description: 'Province code does not exist or is inactive',
  })
  async findOne(@Param('code') code: string): Promise<ProvinceDetailResponse> {
    const province = await this.provinceService.findActiveByCode(code);
    return ProvinceDetailResponse.from(province);
  }
}
