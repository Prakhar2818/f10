export const registerUserSchema = {
  tags: ['Auth'],
  summary: 'Register a new user',
  body: {
    type: 'object',
    required: ['fullName', 'email', 'password'],
    properties: {
      fullName: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'object' },
      },
    },
  },
};

export const loginUserSchema = {
  tags: ['Auth'],
  summary: 'Login user',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
};

export const refreshTokenSchema = {
  tags: ['Auth'],
  summary: 'Refresh access token',
};

export const logoutSchema = {
  tags: ['Auth'],
  summary: 'Logout current user',
  security: [{ bearerAuth: [] }],
};

export const currentUserSchema = {
  tags: ['Auth'],
  summary: 'Get current logged in user',
  security: [{ bearerAuth: [] }],
};
