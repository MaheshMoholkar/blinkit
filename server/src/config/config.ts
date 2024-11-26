import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import Admin from "../models/index.ts";

const MongoDBStore = ConnectMongoDBSession(fastifySession as any);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGO_URI!,
  collection: "sessions",
});

sessionStore.on("error", (err: Error) => {
  console.log(err);
});

export const authenticate = async (email: string, password: string) => {
  if (email == "admin@gmail.com" && password == "123") {
    return Promise.resolve({ email: email, password: password });
  } else {
    return Promise.resolve(null);
  }
};
