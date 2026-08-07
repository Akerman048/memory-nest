import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { hashPassword } from "../src/lib/password.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const passwordHash = await hashPassword("ChangeMe123!");

  const user = await prisma.user.upsert({
    where: {
      email: "valerii@example.com",
    },
    update: {},
    create: {
      name: "Valerii",
      email: "valerii@example.com",
      passwordHash,
      accountRole: "PARENT",
      emailVerifiedAt: new Date(),
    },
  });

  console.log("Temporary test user:", user);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
