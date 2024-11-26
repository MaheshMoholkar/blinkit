import jwt, { JwtPayload } from "jsonwebtoken";
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";
import { JwtTokenBody } from "@/types/auth.ts";

export const verifyToken = (
  req: FastifyRequest,
  res: FastifyReply,
  next: HookHandlerDoneFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).send({ message: "No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    req.user = decodedToken as JwtPayload & JwtTokenBody;

    next();
  } catch (error) {
    return res.status(403).send({ message: "Invalid or expired token" });
  }
};
