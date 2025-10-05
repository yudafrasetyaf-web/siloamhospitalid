@echo off
echo ========================================
echo SILOAM HOSPITAL - ACTIVATE MEDICAL SERVICES
echo ========================================
echo.
echo This script will activate 5 core medical services:
echo 1. Emergency Care
echo 2. Surgery
echo 3. Maternity
echo 4. Cardiology
echo 5. Oncology
echo.
pause

echo.
echo [Step 1] Installing dependencies...
call npm install speakeasy qrcode --save
call npm install @types/speakeasy @types/qrcode --save-dev

echo.
echo [Step 2] Building TypeScript...
call npm run build

echo.
echo [Step 3] Running specializations seeder...
node dist/seeders/specializationSeeder.js

echo.
echo ========================================
echo ✅ SERVICES ACTIVATED SUCCESSFULLY!
echo ========================================
echo.
echo You can now access the services at:
echo GET http://localhost:4000/api/v1/specializations
echo.
pause
