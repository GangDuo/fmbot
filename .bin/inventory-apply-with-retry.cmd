@echo off

:apply
call npm run inventory -- apply %*

if not %ERRORLEVEL% == 0 (
  echo ERROR: Failed to apply inventory
  timeout 60 /nobreak
  goto apply
)

echo Successed to apply inventory
exit /b 0
