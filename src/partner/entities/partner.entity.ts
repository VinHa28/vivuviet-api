import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { PartnerTier } from '../enums/partner-tier.enum.js';
import { PartnerStatus } from '../enums/partner-status.enum.js';
import { User } from '../../user/entities/user.entity.js';

@Entity('partners')
export class Partner {
  @Column({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.partner, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'business_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  businessName: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  website: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  fanpage: string | null;

  @Column({
    name: 'logo_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  logoUrl: string | null;

  @Column({
    type: 'enum',
    enum: PartnerTier,
    nullable: false,
  })
  tier: PartnerTier;

  @Column({
    type: 'enum',
    enum: PartnerStatus,
    nullable: false,
    default: PartnerStatus.PENDING,
  })
  status: PartnerStatus;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null;

  @Column({
    name: 'approved_at',
    type: 'timestamptz',
    precision: 3,
    nullable: true,
  })
  approvedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz', precision: 3, name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3, name: 'updated_at' })
  updatedAt: Date;
}
