import fp from "fastify-plugin";
import helment from "@fastify/helmet";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";

export default fp(async (app) => {
  await app.register(helment);
  await app.register(cors, { origin: true, credentials: true });
  await app.register(sensible);
});
