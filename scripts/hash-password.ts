import crypto from 'node:crypto';

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('Pakai: npm run hash -- "PasswordKuatMin10Karakter"');
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.scryptSync(pw, salt, 64).toString('hex');

console.log(`ADMIN_PASSWORD_HASH="${salt}:${hash}"`);
console.log(`SESSION_SECRET="${crypto.randomBytes(32).toString('hex')}"`);