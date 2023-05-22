export const driversSchema = {
  id: '/Drivers',
  type: 'object',
  required: ['ubication', 'userId','licenseNumber','carModel','carPlateNumber'],
  properties: {
    userId: {
      type: 'string',
    },
    ubication: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        long: { type: 'number' },
      },
      required: ['lat', 'long'],
    },
    licenseNumber: {
      type: 'string',
    },
    carModel: {
      type: 'string',
    },
    carPlateNumber: {
      type: 'string',
    },
  },
};