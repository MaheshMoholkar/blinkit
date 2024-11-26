import { FastifyRequest, FastifyReply } from "fastify";
import {
  CustomerAuthBody,
  DeliveryPartnerAuthBody,
  JwtTokenBody,
} from "@/types/auth.ts";
import { Customer } from "@/models/user.ts";
import { DeliveryPartner } from "@/models/user.ts";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateTokens = (userId: any, role: any) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

export const authenticateCustomer = async (
  req: FastifyRequest<{ Body: CustomerAuthBody }>,
  res: FastifyReply
) => {
  try {
    const { phone } = req.body;

    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({ phone, role: "Customer", isActivated: true });
      await customer.save();
    }

    const { accessToken, refreshToken } = generateTokens(
      customer._id,
      customer.role
    );

    return res.send({
      message: "Login Successful",
      accessToken,
      refreshToken,
      user: customer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const authenticateDeliveryPartner = async (
  req: FastifyRequest<{ Body: DeliveryPartnerAuthBody }>,
  res: FastifyReply
) => {
  try {
    const { email, password } = req.body;

    let deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      return res.status(404).send({ message: "Delivery Partner Not Found" });
    }

    if (deliveryPartner.password !== password) {
      return res.status(401).send({ message: "Invalid Password" });
    }

    const { accessToken, refreshToken } = generateTokens(
      deliveryPartner._id,
      deliveryPartner.role
    );

    return res.send({
      message: "Login Successful",
      accessToken,
      refreshToken,
      user: deliveryPartner,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const refreshAccessToken = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).send({ message: "Refresh Token Not Found" });
    }

    let user: any;
    const decoded = jwt.decode(refreshToken) as jwt.JwtPayload & JwtTokenBody;

    if (!decoded) {
      return res.status(403).send({ message: "Invalid Refresh Token" });
    }

    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return res.status(403).send({ message: "Invalid Token" });
    }

    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user._id,
      user.role
    );

    return res.send({
      message: "Refresh Token Successful",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const fetchUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { userId, role } = req.user as JwtPayload & JwtTokenBody;

    let user: any;
    if (role === "Customer") {
      user = await Customer.findById(userId);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userId);
    } else {
      return res.status(403).send({ message: "Invalid Token" });
    }

    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }
    return res.send({ message: "User Found", user });
  } catch (error: any) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};
