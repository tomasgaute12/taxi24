export const tripsSchema = {
  id: '/Trips',
  type: 'object',
  required: ['passengerId', 'endLocation'],
  properties: {
    passengerId: {
      type: 'string',
    },
    endLocation: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        long: { type: 'number' },
      },
      required: ['lat', 'long'],
    }
  },
};