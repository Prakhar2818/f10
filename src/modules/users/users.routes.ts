import { FastifyInstance } from "fastify";
import { usersController } from "./users.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { PERMISSIONS } from "../../utils/permissions";

export const usersRoutes = async (app: FastifyInstance) => {
  app.post(
    "/admin-create",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_CREATE])],
    },
    usersController.adminCreateUser,
  );
  
  app.get(
    "/",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_READ])],
    },
    usersController.getAllUsers,
  );

  app.get<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_READ])],
    },
    usersController.getUserById,
  );

  app.patch<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_UPDATE])],
    },
    usersController.updateUser,
  );

  app.patch<{ Params: { id: string } }>(
    "/:id/status",
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_DEACTIVATE])],
    },
    usersController.updateUserStatus,
  );
};
