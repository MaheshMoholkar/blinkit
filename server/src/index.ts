import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { connectDB } from "./config/connect.ts";
import dotenv from "dotenv";
import { admin, buildAdminRouter } from "./config/setup.ts";
import { registerRoutes } from "./routes/index.ts";

dotenv.config();

// Create Fastify instance with TypeBox for improved type safety
const server = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

// Start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);

    // Build admin router first as it registers its own form parser
    await buildAdminRouter(server);

    // Register API routes after admin setup
    await registerRoutes(server);

    const port = Number(process.env.PORT) || 3001;
    await server.listen({ port });
    console.log(
      `Blinkit Server Started: http://localhost:${port}${admin.options.rootPath}`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
