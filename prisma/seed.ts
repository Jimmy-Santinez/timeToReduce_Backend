import { PrismaClient, Role } from "@prisma/client";
import "dotenv/config";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "dra@demo.com";

  // ¿Ya existe la doctora?
  let doctorUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!doctorUser) {
    // Si NO existe, creamos tenant + usuario + perfil
    const tenant = await prisma.tenant.create({
      data: { name: "Nutri Demo" },
    });

    const passwordHash = await bcrypt.hash("demo123", 10);

    doctorUser = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email,
        name: "Dra. Demo",
        role: Role.DOCTOR,
        passwordHash,
      },
    });

    await prisma.doctorProfile.create({
      data: {
        userId: doctorUser.id,
        licenseNumber: "ABC123",
        office: "Consultorio 1",
        bio: "Nutrióloga clínica de ejemplo",
      },
    });
  } else {
    // Si SÍ existe, solo actualizamos el passwordHash
    const passwordHash = await bcrypt.hash("demo123", 10);

    doctorUser = await prisma.user.update({
      where: { id: doctorUser.id },
      data: { passwordHash },
    });
  }

  console.log("✅ Seed listo:");
  console.log("   Email: dra@demo.com");
  console.log("   Password: demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
