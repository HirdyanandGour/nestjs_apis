import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@newsportal.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@newsportal.com',
      password,
      role: UserRole.ADMIN,
    },
  });

  await prisma.category.createMany({
    data: [
      { name: 'Politics', slug: 'politics' },
      { name: 'Technology', slug: 'technology' },
      { name: 'Sports', slug: 'sports' },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
