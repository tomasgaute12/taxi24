import { BaseObject, ExtensibleObject } from './common';
import { Users } from './users';

export interface Drivers extends BaseObject, ExtensibleObject {
  licenseNumber: string,
  user: Users,
  carModel: string,
  carPlateNumber: string,
  isActive: boolean,
  ubication: Ubication
}

export interface Ubication {
  lat: number;
  long: number;
}
