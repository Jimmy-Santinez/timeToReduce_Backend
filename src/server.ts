import Fastify from "fastify";
import { ENV } from "./env";
import security from "./plugins/security";
import prismaPlugin from "./plugins/prisma";
import auth from "./plugins/auth";
import me from "./routes/me";
import authRoutes from "./routes/auth";

async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(security);
  await app.register(prismaPlugin);
  await app.register(auth);

  await app.register(authRoutes);
  await app.register(me);

  app.get("/public/health", async () => ({ ok: true }));

  return app;
}

async function main() {
  const app = await buildApp();

  try {
    await app.listen({ port: ENV.PORT, host: "0.0.0.0" });
    app.log.info(`API listening on :${ENV.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
