import { FastifyInstance } from "fastify";
import { recordsController } from "./records.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { PERMISSIONS } from "../../utils/permissions";

export default async function recordsRoutes(fastify: FastifyInstance) {
  // CREATE
  fastify.post(
    "/",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.RECORDS_CREATE])],
    },
    recordsController.createRecord,
  );

  // GET ALL
  fastify.get(
    "/",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.RECORDS_READ])],
    },
    recordsController.getAllRecords,
  );

  // GET BY ID
  fastify.get(
    "/:id",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.RECORDS_READ])],
    },
    recordsController.getRecordById,
  );

  // UPDATE
  fastify.patch(
    "/:id",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.RECORDS_UPDATE])],
    },
    recordsController.updateRecord,
  );

  // DELETE
  fastify.delete(
    "/:id",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.RECORDS_DELETE])],
    },
    recordsController.deleteRecord,
  );
}
