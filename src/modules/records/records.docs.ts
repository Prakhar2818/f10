export const createRecordSchemaDoc = {
  tags: ['Records'],
  summary: 'Create a financial record',
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    required: ['amount', 'type', 'category', 'recordDate'],
    properties: {
      amount: { type: 'number' },
      type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
      category: { type: 'string' },
      recordDate: { type: 'string' },
      description: { type: 'string' },
    },
  },
};

export const getAllRecordsSchemaDoc = {
  tags: ['Records'],
  summary: 'Get all financial records',
  security: [{ bearerAuth: [] }],
  querystring: {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
      category: { type: 'string' },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      search: { type: 'string' },
      page: { type: 'number' },
      limit: { type: 'number' },
    },
  },
};

export const getRecordByIdSchemaDoc = {
  tags: ['Records'],
  summary: 'Get financial record by ID',
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};

export const updateRecordSchemaDoc = {
  tags: ['Records'],
  summary: 'Update a financial record',
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    properties: {
      amount: { type: 'number' },
      type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
      category: { type: 'string' },
      recordDate: { type: 'string' },
      description: { type: 'string' },
    },
  },
};

export const deleteRecordSchemaDoc = {
  tags: ['Records'],
  summary: 'Delete a financial record',
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};
