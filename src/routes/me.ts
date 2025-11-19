import { FastifyInstance } from "fastify";

export default async function meRoutes(app: FastifyInstance) {
  app.addHook("onRequest", app.authenticate);

  app.get("/me", async (req: any) => {
    const { user_id, tenant_id, role } = req.user || {};
    return { userId: user_id, tenantId: tenant_id, role };
  });
}
