import { BaseObject, ExtensibleObject } from './common';
import { Passengers } from './passengers';
import { Trips } from './trips';

export interface Invoices extends BaseObject, ExtensibleObject {
  passenger: Passengers,
  amount: number,
  trip: Trips
}
