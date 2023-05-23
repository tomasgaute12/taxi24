import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Trips } from '../models/trips';
import { Passengers } from '../models/passengers';
import { PassengersEntity } from './passenger.entity';
import { TripsEntity } from './trips.entity';
import { Invoices } from '../models/invoices';


@Entity({ name: 'invoices' })
export class InvoicesEntity implements Invoices {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'amount', type: 'float', nullable: true })
    amount: number;

  @ManyToOne(() => TripsEntity, (trip) => trip.id, { nullable: false })
  @JoinColumn({ name: 'trip', referencedColumnName: 'id' })
    trip: Trips;

  @ManyToOne(() => PassengersEntity, (passenger) => passenger.id, { nullable: false })
  @JoinColumn({ name: 'passenger', referencedColumnName: 'id' })
    passenger: Passengers;
  
  @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: () => 'now()' })
    createdAt: Date;

  @Column({ name: 'extras', type: 'jsonb', nullable: false, default: JSON.stringify({ firstRun: false }) })
    extras: object;

}
