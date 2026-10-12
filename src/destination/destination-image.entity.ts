import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Destination } from './destination.entity.js';

@Entity('destination_images')
export class DestinationImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'destination_id' })
  destinationId: number;

  @ManyToOne(() => Destination, (destination) => destination.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'destination_id' })
  destination: Relation<Destination>;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 255, name: 'public_id', nullable: true })
  publicId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  caption: string | null;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamptz', precision: 3, name: 'created_at' })
  createdAt: Date;
}
