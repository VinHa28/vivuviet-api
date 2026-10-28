import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from './destination.entity.js';
import { DestinationService } from './destination.service.js';
import { DestinationImage } from './destination-image.entity.js';
import { PublicDestinationsController } from './public-destinations.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Destination, DestinationImage])],
  providers: [DestinationService],
  controllers: [PublicDestinationsController]
})
export class DestinationModule {}
