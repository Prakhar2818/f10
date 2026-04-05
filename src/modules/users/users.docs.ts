export const getUsersSchemaDoc = {
  tags: ['Users'],
  summary: 'Get all users',
  security: [{ bearerAuth: [] }],
};

export const getUserByIdSchemaDoc = {
  tags: ['Users'],
  summary: 'Get user by ID',
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};

export const adminCreateUserSchemaDoc = {
  tags: ['Users'],
  summary: 'Admin creates a new user',
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    required: ['fullName', 'email', 'password', 'roleName'],
    properties: {
      fullName: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      roleName: { type: 'string', enum: ['ADMIN', 'ANALYST', 'VIEWER'] },
    },
  },
};

export const updateUserSchemaDoc = {
  tags: ['Users'],
  summary: 'Update user details',
  security: [{ bearerAuth: [] }],
};

export const updateUserStatusSchemaDoc = {
  tags: ['Users'],
  summary: 'Update user status',
  security: [{ bearerAuth: [] }],
};
