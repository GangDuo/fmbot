@echo off
setlocal

set FMWW_SIGN_IN_URL=https://
set FMWW_ORGANIZATION_CODE=
set FMWW_ORGANIZATION_PASS=
set FMWW_USER_CODE=
set FMWW_USER_PASS=

:meta
echo --------------------------------
echo             �����ݒ�
echo --------------------------------
set /P FMWW_SIGN_IN_URL="�T�[�o�[URL: "
set /P FMWW_ORGANIZATION_CODE="��ЃR�[�h: "
set /P FMWW_ORGANIZATION_PASS="��Ѓp�X���[�h: "
set /P FMWW_USER_CODE="�S���҃R�[�h: "
set /P FMWW_USER_PASS="�S���҃p�X���[�h: "

echo --------------------------------
echo           ���͓��e�m�F
echo --------------------------------
echo %FMWW_SIGN_IN_URL%
echo %FMWW_ORGANIZATION_CODE% : %FMWW_USER_CODE%
echo %FMWW_ORGANIZATION_PASS% : %FMWW_USER_PASS%

SET /P ANSWER="�o�^���܂��� (Y/N)�H"

if /i {%ANSWER%}=={q} (goto :eof)
if /i {%ANSWER%}=={y} (goto :yes)
if /i {%ANSWER%}=={yes} (goto :yes) ELSE (
  goto :meta
)

:yes

rem �����J�n
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
