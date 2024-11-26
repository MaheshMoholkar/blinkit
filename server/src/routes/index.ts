import { FastifyInstance } from "fastify";
import { authRoutes } from "./authRoutes.ts";

const prefix = "/api/v1";

export const registerRoutes = async (fastify: FastifyInstance) => {
  await fastify.register(authRoutes, { prefix });
};
