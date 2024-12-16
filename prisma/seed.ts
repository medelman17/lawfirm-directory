import { PrismaClient } from "@prisma/client";
import { lawFirms } from "./data/law-firms";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clear existing data
  await prisma.lawFirm.deleteMany();

  // Create law firms in batches to avoid overwhelming the database
  const batchSize = 50;
  for (let i = 0; i < lawFirms.length; i += batchSize) {
    const batch = lawFirms.slice(i, i + batchSize);
    await Promise.all(
      batch.map((firm) =>
        prisma.lawFirm.create({
          data: firm,
        })
      )
    );
    console.log(`Created law firms ${i + 1} to ${Math.min(i + batchSize, lawFirms.length)}`);
  }

  const count = await prisma.lawFirm.count();
  console.log(`Seeding finished. Created ${count} law firms.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
