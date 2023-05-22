import { BaseObject, ExtensibleObject } from './common';
import { Users } from './users';

export interface Passengers extends BaseObject, ExtensibleObject {
  ubication: Ubication,
  user: Users
}

export interface Ubication {
  lat: number;
  long: number;
}