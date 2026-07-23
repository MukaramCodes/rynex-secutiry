const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const ceoEmail = 'ceo@rynexsecurity.com';
  
  // Check if CEO already exists
  const existingCeo = await prisma.user.findUnique({
    where: { email: ceoEmail },
  });

  if (existingCeo) {
    console.log('CEO account already exists.');
    return;
  }

  // Hash temporary password
  const tempPassword = 'CEOAdminPassword2026!';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(tempPassword, salt);

  // Create CEO
  const ceo = await prisma.user.create({
    data: {
      name: 'CEO Admin',
      email: ceoEmail,
      passwordHash: passwordHash,
      role: 'CEO',
      isActive: true,
      mustChangePassword: true,
      allowedIp: '192.168.1.17',
    },
  });

  console.log(`CEO account created successfully!`);
  console.log(`Email: ${ceo.email}`);
  console.log(`Temporary Password: ${tempPassword}`);
  console.log('You will be forced to change this password on your first login.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
