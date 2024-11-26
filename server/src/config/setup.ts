import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { authenticate, sessionStore } from "./config.ts";
import dotenv from "dotenv";
import { Customer, DeliveryPartner } from "../models/user.ts";
import Branch from "../models/branch.ts";
import { dark, light, noSidebar } from "@adminjs/themes";
import { Order } from "@/models/order.ts";
import { Counter } from "@/models/counter.ts";
import { Category } from "@/models/category.ts";
import { Product } from "@/models/products.ts";

dotenv.config();

AdminJS.registerAdapter(AdminJSMongoose);

const usersNavigation = {
  name: "Blinkit",
  icon: "User",
};

export const admin = new AdminJS({
  resources: [
    {
      resource: Customer,
      options: {
        navigation: usersNavigation,
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: DeliveryPartner,
      options: {
        navigation: usersNavigation,
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Branch,
      options: {
        navigation: usersNavigation,
      },
    },
    {
      resource: Product,
      options: {
        navigation: usersNavigation,
      },
    },
    {
      resource: Category,
      options: {
        navigation: usersNavigation,
      },
    },
    {
      resource: Order,
      options: {
        navigation: usersNavigation,
      },
    },
    {
      resource: Counter,
      options: {
        navigation: usersNavigation,
      },
    },
  ],

  branding: {
    companyName: "Blinkit",
    withMadeWithLove: false,
  },
  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
  rootPath: "/admin",
});

export const buildAdminRouter = async (app: any) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiePassword: process.env.COOKIE_SECRET!,
      cookieName: "adminjs",
    },
    app,
    {
      store: sessionStore,
      saveUninitialized: true,
      secret: process.env.COOKIE_SECRET!,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
};
