' 2> Nul & @Cls & @Cscript //NoLogo //E:VBScript "%~f0" %* & @pause & @Exit /b
' �������牺��VBScript�̃X�N���v�g���ł�

Set WshShell = Wscript.CreateObject("Wscript.Shell")

d = Date()

For i = 0 To 39
	' yyyy-mm-dd
	s1 = Replace(DateAdd("d", i - 40, d), "/", "-")

	cmd = "%comspec% /c call npm run mv -- export -b " & s1 & " -e " & s1 & " -r 9000 -o mv_" & s1 & ".csv"
	WScript.Echo cmd
	Set outExec = WshShell.Exec(cmd)
	Do While outExec.Status = 0
		' �W���u�͂܂����s���ł��B
	     WScript.Sleep 100
	Loop

Next

Set WshShell = Nothing

WScript.Quit
