import { PrismaClient } from "@prisma/client";
import { lawFirms } from "./data/law-firms";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  for (const firm of lawFirms) {
    await prisma.lawFirm.upsert({
      where: { slug: firm.slug },
      update: {
        isActive: firm.isActive,
        metadata: firm.metadata,
      },
      create: {
        name: firm.name,
        slug: firm.slug,
        website: firm.website,
        isActive: firm.isActive,
        metadata: firm.metadata,
      },
    });
  }

  const count = await prisma.lawFirm.count();
  console.log(`Seed completed. Database has ${count} law firms.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
