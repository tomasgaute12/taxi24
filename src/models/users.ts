import { BaseObject, ExtensibleObject } from './common';

export interface Users extends BaseObject, ExtensibleObject {
  name: string 
  lastname: string
  phone: string
  email: string
  username: string
  password?: string,
}
