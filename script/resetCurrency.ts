import { PrismaClient } from "@prisma/client";

(async () => {
  const db = new PrismaClient();
  const users = await db.users.findMany();
  console.log(`Found ${users.length} users.`);
  for (const user of users) {
    console.log(`Processing user ${user.userId}`);
    await db.users.update({
      where: {
        userId: user.userId,
      },
      data: {
        currency: {
          copper: 0,
          silver: 0,
          gold: 0,
          platinum: 0,
          amethyst: 0,
        },
      },
    });
  }
})();
