import { FastifyRequest } from "fastify";
import { JwtTokenBody } from "./auth.ts";

declare module "fastify" {
  interface FastifyRequest {
    user?: JwtTokenBody;
  }
}

export {};
