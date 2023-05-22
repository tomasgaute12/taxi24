export const passengersSchema = {
  id: '/Passengers',
  type: 'object',
  required: ['ubication', 'userId'],
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
    }
  },
};