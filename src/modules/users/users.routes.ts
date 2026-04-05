import { FastifyInstance } from "fastify";
import { usersController } from "./users.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { PERMISSIONS } from "../../utils/permissions";
import {
  adminCreateUserSchemaDoc,
  getUserByIdSchemaDoc,
  getUsersSchemaDoc,
  updateUserSchemaDoc,
  updateUserStatusSchemaDoc,
} from "./users.docs";

export const usersRoutes = async (app: FastifyInstance) => {
  app.post(
    "/admin-create",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_CREATE])],
      schema: adminCreateUserSchemaDoc,
    },
    usersController.adminCreateUser,
  );
  
  app.get(
    "/",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_READ])],
      schema: getUsersSchemaDoc,
    },
    usersController.getAllUsers,
  );

  app.get<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_READ])],
      schema: getUserByIdSchemaDoc,
    },
    usersController.getUserById,
  );

  app.patch<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_UPDATE])],
      schema: updateUserSchemaDoc,
    },
    usersController.updateUser,
  );

  app.patch<{ Params: { id: string } }>(
    "/:id/status",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_DEACTIVATE])],
      schema: updateUserStatusSchemaDoc,
    },
    usersController.updateUserStatus,
  );
};
