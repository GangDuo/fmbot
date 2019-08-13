@echo off
pushd %~dp0
set PATH="%~dp0";%PATH%
set FMWW_SIGN_IN_URL=https://
set FMWW_ORGANIZATION_CODE=
set FMWW_ORGANIZATION_PASS=
set FMWW_USER_CODE=
set FMWW_USER_PASS=

echo.
echo "              ________  _______  ____  ______
echo "             / ____/  |/  / __ )/ __ \/_  __/
echo "            / /_  / /|_/ / __  / / / / / /   
echo "           / __/ / /  / / /_/ / /_/ / / /    
echo "          /_/   /_/  /_/_____/\____/ /_/     
echo.
echo.
echo.

:meta
echo --------------------------------
echo             初期設定
echo --------------------------------
set /P FMWW_SIGN_IN_URL="サーバーURL: "
set /P FMWW_ORGANIZATION_CODE="会社コード: "
set /P FMWW_ORGANIZATION_PASS="会社パスワード: "
set /P FMWW_USER_CODE="担当者コード: "
set /P FMWW_USER_PASS="担当者パスワード: "

echo --------------------------------
echo           入力内容確認
echo --------------------------------
echo %FMWW_SIGN_IN_URL%
echo %FMWW_ORGANIZATION_CODE% : %FMWW_USER_CODE%
echo %FMWW_ORGANIZATION_PASS% : %FMWW_USER_PASS%

SET /P ANSWER="登録しますか (Y/N)？"

if /i {%ANSWER%}=={q} (goto :eof)
if /i {%ANSWER%}=={y} (goto :yes)
if /i {%ANSWER%}=={yes} (goto :yes) ELSE (
  goto :meta
)

EXIT

:yes

rem 処理開始
del .env
(
echo FMWW_SIGN_IN_URL=%FMWW_SIGN_IN_URL%
echo FMWW_ACCESS_KEY_ID=%FMWW_ORGANIZATION_CODE%
echo FMWW_SECRET_ACCESS_KEY=%FMWW_ORGANIZATION_PASS%
echo FMWW_USER_NAME=%FMWW_USER_CODE%
echo FMWW_PASSWORD=%FMWW_USER_PASS%
) > .env

type .env

call npm install
pause
