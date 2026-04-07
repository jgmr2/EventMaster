@echo off

:: Verificar si se pasó un argumento (mensaje de commit)
if "%~1"=="" (
    echo ❌ Debes escribir un mensaje de commit
    echo Ejemplo: auto_commit.bat "mi mensaje"
    exit /b 1
)

:: Guardar el mensaje
set mensaje=%~1

echo 🔄 Haciendo pull...
git pull origin Saul

echo 📂 Agregando archivos...
git add .\src\docs\*

echo 💾 Haciendo commit...
git commit -m "%mensaje%"

echo 🚀 Haciendo push...
git push origin Saul

echo ✅ Listo Saul 😎
pause