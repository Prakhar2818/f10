export const getSummarySchemaDoc = {
  tags: ['Dashboard'],
  summary: 'Get dashboard summary',
  security: [{ bearerAuth: [] }],
};

export const getCategoryBreakdownSchemaDoc = {
  tags: ['Dashboard'],
  summary: 'Get category-wise breakdown',
  security: [{ bearerAuth: [] }],
};

export const getRecentActivitySchemaDoc = {
  tags: ['Dashboard'],
  summary: 'Get recent financial activity',
  security: [{ bearerAuth: [] }],
};

export const getMonthlyTrendsSchemaDoc = {
  tags: ['Dashboard'],
  summary: 'Get monthly financial trends',
  security: [{ bearerAuth: [] }],
  querystring: {
    type: 'object',
    properties: {
      year: { type: 'number' },
    },
  },
};
