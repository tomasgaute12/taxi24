import { BaseObject, ExtensibleObject } from './common';
import { Drivers } from './drivers';
import { Passengers } from './passengers';

export interface Trips extends BaseObject, ExtensibleObject {
  driver: Drivers,
  passenger: Passengers,
  startLocation : Ubication,
  endLocation: Ubication,
  startTime: number,
  endTime: number,
  state: TripsState,
  price: number;
}

export interface Ubication {
  lat: number;
  long: number;
}

export enum TripsState {
  INITIATED = 'INITIATED',
  FINISHED  = 'FINISHED ',
}


export interface ShowTrip {
  id:string,
  estimatedTime?: Date,
  price: number,
  driver?: Drivers,
  passenger?: Passengers,
}