const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding non-admin testing accounts...');

  const devPassword = 'DevTestPassword2026!';
  const internPassword = 'InternTestPassword2026!';

  const salt = await bcrypt.genSalt(10);
  const devHash = await bcrypt.hash(devPassword, salt);
  const internHash = await bcrypt.hash(internPassword, salt);

  // 1. Developer Account
  const developer = await prisma.user.upsert({
    where: { email: 'developer.test@rynexsecurity.com' },
    update: {
      passwordHash: devHash,
      role: 'DEVELOPER',
      isActive: true,
      mustChangePassword: false,
    },
    create: {
      name: 'Dev Tester',
      email: 'developer.test@rynexsecurity.com',
      passwordHash: devHash,
      role: 'DEVELOPER',
      department: 'TECHNICAL',
      isActive: true,
      mustChangePassword: false,
    },
  });

  // 2. Intern Account
  const intern = await prisma.user.upsert({
    where: { email: 'intern.test@rynexsecurity.com' },
    update: {
      passwordHash: internHash,
      role: 'INTERN',
      isActive: true,
      mustChangePassword: false,
    },
    create: {
      name: 'Intern Tester',
      email: 'intern.test@rynexsecurity.com',
      passwordHash: internHash,
      role: 'INTERN',
      department: 'TECHNICAL',
      isActive: true,
      mustChangePassword: false,
    },
  });

  console.log('----------------------------------------------------');
  console.log('✅ Testing Accounts Seeded Successfully!');
  console.log('----------------------------------------------------');
  console.log(`1. DEVELOPER ACCOUNT (Project Work, Tasks & Reports):`);
  console.log(`   Email:    ${developer.email}`);
  console.log(`   Password: ${devPassword}`);
  console.log(`   Role:     DEVELOPER`);
  console.log('----------------------------------------------------');
  console.log(`2. INTERN ACCOUNT (Task Submissions & Assignments):`);
  console.log(`   Email:    ${intern.email}`);
  console.log(`   Password: ${internPassword}`);
  console.log(`   Role:     INTERN`);
  console.log('----------------------------------------------------');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding test accounts:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
