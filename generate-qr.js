#!/usr/bin/env node

const qrcode = require('qrcode-terminal');

// Check-in QR Kodu
const checkInQR = 'BIOYUNBIKAHVE_CHECKIN';

console.log('\n===========================================');
console.log('  Bi Oyun Bi Kahve - Check-In QR Kodu');
console.log('===========================================\n');
console.log('Bu QR kodu işletme girişine asılacak.');
console.log('Müşteriler bu QR\'ı okutarak check-in yapabilir.\n');

qrcode.generate(checkInQR, { small: true }, function(qr) {
  console.log(qr);
  console.log('\nQR Kod İçeriği:', checkInQR);
  console.log('\nKullanım: Müşteriler uygulamada "QR Check-In"');
  console.log('butonuna tıklayıp bu kodu okutacak.\n');
  console.log('===========================================\n');
});
