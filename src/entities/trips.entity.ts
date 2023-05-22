import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Drivers, Ubication } from '../models/drivers';
import { Trips, TripsState } from '../models/trips';
import { DriversEntity } from './drivers.entity';
import { Passengers } from '../models/passengers';
import { PassengersEntity } from './passenger.entity';


@Entity({ name: 'trips' })
export class TripsEntity implements Trips {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'startTime', type: 'bigint', nullable: false })
    startTime: number;

  @Column({ name: 'endTime', type: 'bigint', nullable: true })
    endTime: number;

  @Column({ name: 'startLocation', type: 'jsonb', nullable: false })
    startLocation: Ubication;

  @Column({ name: 'endLocation', type: 'jsonb', nullable: false })
    endLocation: Ubication;
  
  @Column({ name: 'state', type: 'varchar', nullable: false })
    state: TripsState;

  @ManyToOne(() => DriversEntity, (driver) => driver.id, { nullable: false })
  @JoinColumn({ name: 'driver', referencedColumnName: 'id' })
    driver: Drivers;

  @ManyToOne(() => PassengersEntity, (passenger) => passenger.id, { nullable: false })
  @JoinColumn({ name: 'passenger', referencedColumnName: 'id' })
    passenger: Passengers;
  
  @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: () => 'now()' })
    createdAt: Date;

  @Column({ name: 'extras', type: 'jsonb', nullable: false, default: JSON.stringify({ firstRun: false }) })
    extras: object;

}
