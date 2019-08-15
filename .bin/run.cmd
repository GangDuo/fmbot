@echo off
setlocal

set d=%date%

REM ���t��N�A���A���ɕ�������
set yyyy=%d:~-10,4%
set mm=%d:~-5,2%
set dd=%d:~-2,2%

set t=%time: =0%

REM ���Ԃ����A���A�b�ɕ�������
set hh=%t:~0,2%
set mn=%t:~3,2%
set ss=%t:~6,2%

set "WORK_DIR=%temp%\.fmbot_%yyyy%%mm%%dd%_%hh%%mn%%ss%"

mkdir "%WORK_DIR%"

npm start "%WORK_DIR%" %*

dir /A-D /B /S "%WORK_DIR%" | findstr /i "products\.xlsx$" | cscript //nologo "%FMBOT_HOME%ms-excel\Excel.wsf"

rmdir /s /q "%WORK_DIR%"
