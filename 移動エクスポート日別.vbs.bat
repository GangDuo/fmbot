' 2> Nul & @Cls & @Cscript //NoLogo //E:VBScript "%~f0" %* & @pause & @Exit /b
' ここから下がVBScriptのスクリプト文です

Set WshShell = Wscript.CreateObject("Wscript.Shell")

d = Date()

For i = 0 To 39
	' yyyy-mm-dd
	s1 = Replace(DateAdd("d", i - 40, d), "/", "-")

	cmd = "%comspec% /c call npm run mv -- export -b " & s1 & " -e " & s1 & " -r 9000 -o mv_" & s1 & ".csv"
	WScript.Echo cmd
	Set outExec = WshShell.Exec(cmd)
	Do While outExec.Status = 0
		' ジョブはまだ実行中です。
	     WScript.Sleep 100
	Loop

Next

Set WshShell = Nothing

WScript.Quit
