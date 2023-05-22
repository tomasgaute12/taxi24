export const usersSchema = {
  id: '/Users',
  type: 'object',
  required: [
    'name',
    'lastname',
    'phone',
    'email',
    'username',
    'password',
    "role",
  ],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 128,
    },
    lastname: {
      type: 'string',
      minLength: 1,
      maxLength: 128,
    },
    phone: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    username: {
      type: 'string',
      minLength: 1,
      maxLength: 64,
    },
    password: {
      type: 'string',
      minLength: 1,
    },
    role: {
      type: 'string',
      enum: ['PASSENGER', 'DRIVER'],
    },
    // status: {
    //   type: 'string',
    //   enum: ['active', 'inactive', 'deactivated'],
    // },
  },
};
