import { FastifyInstance } from "fastify";
import { dashboardController } from "./dashboard.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { PERMISSIONS } from "../../utils/permissions";
import {
  getCategoryBreakdownSchemaDoc,
  getMonthlyTrendsSchemaDoc,
  getRecentActivitySchemaDoc,
  getSummarySchemaDoc,
} from "./dashboard.docs";

export default async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/summary",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.DASHBOARD_READ])],
      schema: getSummarySchemaDoc,
    },
    dashboardController.getSummary,
  );

  fastify.get(
    "/category-breakdown",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.DASHBOARD_READ])],
      schema: getCategoryBreakdownSchemaDoc,
    },
    dashboardController.getCategoryBreakdown,
  );

  fastify.get(
    "/recent-activity",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.DASHBOARD_READ])],
      schema: getRecentActivitySchemaDoc,
    },
    dashboardController.getRecentActivity,
  );

  fastify.get(
    "/monthly-trends",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.DASHBOARD_READ])],
      schema: getMonthlyTrendsSchemaDoc,
    },
    dashboardController.getMonthlyTrends,
  );
}
