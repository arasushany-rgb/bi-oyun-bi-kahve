/**
 * QR Kod Yardımcı Fonksiyonları
 * 
 * Bu dosya işletme için QR kodları oluşturur
 */

export const QR_CODES = {
  CHECK_IN: 'BIOYUNBIKAHVE_CHECKIN',
  CAFE: 'BIOYUNBIKAHVE_CAFE',
  WORKSHOP: 'BIOYUNBIKAHVE_WORKSHOP',
};

/**
 * Check-in QR Kodu
 * Bu QR kodu işletme girişine asılacak
 */
export const getCheckInQRData = () => {
  return QR_CODES.CHECK_IN;
};

/**
 * Masa QR Kodu
 * Her masa için farklı QR kod
 */
export const getTableQRData = (tableNumber) => {
  return `BIOYUNBIKAHVE_TABLE_${tableNumber}`;
};

/**
 * QR Kod Doğrulama
 */
export const validateQRCode = (data) => {
  if (data === QR_CODES.CHECK_IN) {
    return { valid: true, type: 'checkin' };
  }
  
  if (data.startsWith('BIOYUNBIKAHVE_TABLE_')) {
    const tableNumber = data.replace('BIOYUNBIKAHVE_TABLE_', '');
    return { valid: true, type: 'table', tableNumber };
  }
  
  return { valid: false };
};

export default {
  QR_CODES,
  getCheckInQRData,
  getTableQRData,
  validateQRCode,
};
