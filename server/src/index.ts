import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { connectDB } from "./config/connect.ts";
import "dotenv/config";
import { admin, buildAdminRouter } from "./config/setup.ts";

// Create Fastify instance with TypeBox for improved type safety
const server = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

// Start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);

    await buildAdminRouter(server);

    const port = Number(process.env.PORT) || 3001;
    server.listen({ port });
    console.log(
      `Blinkit Server Started: http://localhost:${port}${admin.options.rootPath}`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
