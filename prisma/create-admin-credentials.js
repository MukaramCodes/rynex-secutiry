const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Admin Credentials...');

  const salt = await bcrypt.genSalt(10);

  // 1. CEO Account
  const ceoEmail = 'ceo@rynexsecurity.com';
  const ceoPassword = 'CEOSecurePass2026!';
  const ceoHash = await bcrypt.hash(ceoPassword, salt);

  const defaultAdminIp = '192.168.1.17';

  const ceo = await prisma.user.upsert({
    where: { email: ceoEmail },
    update: {
      passwordHash: ceoHash,
      isActive: true,
      mustChangePassword: false,
      role: 'CEO',
      allowedIp: defaultAdminIp,
    },
    create: {
      name: 'CEO Admin',
      email: ceoEmail,
      passwordHash: ceoHash,
      role: 'CEO',
      isActive: true,
      mustChangePassword: false,
      allowedIp: defaultAdminIp,
    },
  });

  // 2. System Administrator Account
  const adminEmail = 'admin@rynexsecurity.com';
  const adminPassword = 'AdminSecurityPass2026!';
  const adminHash = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminHash,
      isActive: true,
      mustChangePassword: false,
      role: 'ADMIN',
      allowedIp: defaultAdminIp,
    },
    create: {
      name: 'System Administrator',
      email: adminEmail,
      passwordHash: adminHash,
      role: 'ADMIN',
      isActive: true,
      mustChangePassword: false,
      allowedIp: defaultAdminIp,
    },
  });

  console.log('\n=============================================');
  console.log('  ADMIN CREDENTIALS CREATED SUCCESSFULLY ');
  console.log('=============================================');
  console.log(`1. CEO Admin Account:`);
  console.log(`   - Email: ${ceo.email}`);
  console.log(`   - Password: ${ceoPassword}`);
  console.log(`   - Role: ${ceo.role}`);
  console.log(`\n2. System Administrator Account:`);
  console.log(`   - Email: ${admin.email}`);
  console.log(`   - Password: ${adminPassword}`);
  console.log(`   - Role: ${admin.role}`);
  console.log('=============================================\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error creating admin accounts:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
