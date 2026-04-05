import { FastifyReply, FastifyRequest } from 'fastify';
import { dashboardService } from './dashboard.service';
import { successResponse } from '../../utils/response';
import { monthlyTrendQuerySchema } from './dashboard.schema';

export const dashboardController = {
  // SUMMARY
  getSummary: async (_request: FastifyRequest, reply: FastifyReply) => {
    const summary = await dashboardService.getSummary();

    return reply
      .status(200)
      .send(successResponse('Dashboard summary fetched successfully', summary));
  },

  // CATEGORY BREAKDOWN
  getCategoryBreakdown: async (_request: FastifyRequest, reply: FastifyReply) => {
    const breakdown = await dashboardService.getCategoryBreakdown();

    return reply
      .status(200)
      .send(successResponse('Category breakdown fetched successfully', breakdown));
  },

  // RECENT ACTIVITY
  getRecentActivity: async (_request: FastifyRequest, reply: FastifyReply) => {
    const recent = await dashboardService.getRecentActivity();

    return reply
      .status(200)
      .send(successResponse('Recent activity fetched successfully', recent));
  },

  // MONTHLY TRENDS
  getMonthlyTrends: async (request: FastifyRequest, reply: FastifyReply) => {
    const query = monthlyTrendQuerySchema.parse(request.query);

    const trends = await dashboardService.getMonthlyTrends(query.year);

    return reply
      .status(200)
      .send(successResponse('Monthly trends fetched successfully', trends));
  },
};