import sensible from "@fastify/sensible";
import { FastifyInstance } from "fastify";

export const registerSensible = async (app: FastifyInstance) => {
  await app.register(sensible);
};
