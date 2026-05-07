const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const societies = [
    { name: "ACM GIKI Chapter", description: "Association for Computing Machinery - The premier computing society at GIKI." },
    { name: "IEEE GIKI", description: "Institute of Electrical and Electronics Engineers - Advancing technology for humanity." },
    { name: "SOPHEP", description: "Society of Photo-Optical Instrumentation Engineers - Focusing on physics and optics." },
    { name: "GSS", description: "GIKI Sports Society - Promoting physical health and sportsmanship." },
    { name: "LDS", description: "Literary and Debating Society - The voice of GIKI." },
    { name: "GDS", description: "GIKI Dramatic Society - Bringing art and theater to campus." },
  ];

  for (const society of societies) {
    await prisma.group.upsert({
      where: { id: society.name }, // This won't work with uuid id, using name check instead
      update: {},
      create: {
        name: society.name,
        department: "General",
      },
    });
  }

  console.log("Societies seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
