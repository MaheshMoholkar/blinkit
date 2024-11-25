import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { connectDB } from "./config/connect.js";
import "dotenv/config";

// Create Fastify instance with TypeBox for improved type safety
const server = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

// Start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);

    await server.listen({ port: 3000 });
    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`Blinkit Server on ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
