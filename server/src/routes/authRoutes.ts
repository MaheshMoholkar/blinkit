import {
  authenticateCustomer,
  authenticateDeliveryPartner,
  refreshAccessToken,
  fetchUser,
} from "@/controllers/auth/auth.ts";
import { verifyToken } from "@/middlewares/auth.ts";
import { FastifyInstance } from "fastify";

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/customer/authenticate", authenticateCustomer);
  fastify.post("/deliveryPartner/authenticate", authenticateDeliveryPartner);
  fastify.post("/refreshAccessToken", refreshAccessToken);
  fastify.get("/user", { preHandler: [verifyToken] }, fetchUser);
};
