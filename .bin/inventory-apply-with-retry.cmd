@echo off

:apply
echo �X�V���J�n���܂��B
rem �L�����Z���\���Ԃ�5�b�Ƃ���
timeout 5 /nobreak
call npm run inventory -- apply %*

if not %ERRORLEVEL% == 0 (
  echo ERROR: Failed to apply inventory
  timeout 60 /nobreak
  goto apply
)

echo Successed to apply inventory
exit /b 0
