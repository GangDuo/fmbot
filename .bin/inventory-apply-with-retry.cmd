@echo off

:apply
echo 更新を開始します。
rem キャンセル可能時間を5秒とする
timeout 5 /nobreak
call npm run inventory -- apply %*

if not %ERRORLEVEL% == 0 (
  echo ERROR: Failed to apply inventory
  timeout 60 /nobreak
  goto apply
)

echo Successed to apply inventory
exit /b 0
