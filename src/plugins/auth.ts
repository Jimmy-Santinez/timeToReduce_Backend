import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { ENV } from "../env";

export default fp(async (app) => {
  if (!ENV.JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined in .env");
  }

  await app.register(fastifyJwt, {
    secret: ENV.JWT_SECRET,
  });

  app.decorate("authenticate", async (req: any, reply: any): Promise<void> => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.unauthorized();
    }
  });
});

// 👇 Aquí es donde definimos el tipo de `user`
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      user_id: string;
      tenant_id?: string;
      role?: string;
    };
  }
}

// 👇 Y aquí solo añadimos `authenticate` al tipo de FastifyInstance
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: any, reply: any) => Promise<void>;
  }
}
