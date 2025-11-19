import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";

export default async function authRoutes(app: FastifyInstance) {
  // Login con email + password
  app.post("/auth/login", async (req, reply) => {
    const body = req.body as { email?: string; password?: string };

    const email = body?.email?.toLowerCase().trim();
    const password = body?.password;

    // Validación básica
    if (!email || !password) {
      return reply.badRequest("email and password are required");
    }

    // Buscar usuario por email
    const user = await app.prisma.user.findUnique({
      where: { email },
    });

    // Si no existe o no tiene passwordHash, rechazamos
    if (!user || !user.passwordHash) {
      return reply.unauthorized("Invalid email or password");
    }

    // Comparar password plano contra el hash guardado
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return reply.unauthorized("Invalid email or password");
    }

    // Si llegó aquí, el login es correcto → construimos el payload del JWT
    const payload = {
      user_id: user.id,
      tenant_id: user.tenantId,
      role: user.role,
    };

    const token = app.jwt.sign(payload);

    return reply.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
    });
  });
}
