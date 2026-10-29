import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Partner])],
})
export class PartnerModule {}
