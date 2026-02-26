# Expo'yu QR kod ile başlat
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Bi Oyun Bi Kahve - QR Kod" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Dizine git
Set-Location "C:\Users\90555\OneDrive\Desktop\Bi Oyun  Bi Kahve"

# Expo'yu başlat
Write-Host "Expo başlatılıyor..." -ForegroundColor Green
npx expo start --qr

Write-Host ""
Write-Host "QR kod yukarıda görünecek!" -ForegroundColor Green
Write-Host "Expo Go uygulamasıyla QR kodu okutun." -ForegroundColor Yellow
