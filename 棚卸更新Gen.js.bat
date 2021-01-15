@if(0)==(0) echo off
cscript //nologo /E:JScript "%~f0" %*
goto :EOF
@end

/**
 *
 * -------------------------------------------------------------
 * 概要
 * -------------------------------------------------------------
 * 標準入力からデータソースを読込み、棚卸更新スクリプトを自動生成する。
 *
 * ■棚卸更新スクリプト
 * 棚卸更新ページで実行ボタンをクリックする。
 *
 * ■データソースのグループ化
 * 店舗
 * └棚卸日付
 *   ├棚卸初日 --zero-fill
 *   └それ以外
 *
 * ■オプション
 * npm run inventory -- apply --help
 *
 * -------------------------------------------------------------
 * データソース生成
 * -------------------------------------------------------------
 *   SELECT DISTINCT `date`, store
 *     FROM humpty_dumpty.invt_results
 * ORDER BY store, `date`;
 *
 * -------------------------------------------------------------
 * 棚卸更新.bat生成
 * -------------------------------------------------------------
 * 棚卸更新Gen.js.bat<棚卸更新DataSource.txt>棚卸更新.bat
 *
 */

var dateByStore = {}
var stdin = WScript.StdIn;
var stdout = WScript.StdOut;

while (!stdin.AtEndOfStream) {
    var str = stdin.ReadLine();
//    stdout.WriteLine("Line " + (stdin.Line - 1) + ": " + str);
    var xs = str.split(/\t/);
    dateByStore[xs[1]] = dateByStore[xs[1]] || []
	dateByStore[xs[1]].push(xs[0])
}

stdout.WriteLine("@echo off")
stdout.WriteLine("set yyyy=%date:~0,4%")
stdout.WriteLine("set mm=%date:~5,2%")
stdout.WriteLine("set dd=%date:~8,2%")
stdout.WriteLine("set time2=%time: =0%")
stdout.WriteLine("set hh=%time2:~0,2%")
stdout.WriteLine("set mn=%time2:~3,2%")
stdout.WriteLine("set ss=%time2:~6,2%")
stdout.WriteLine("set filename=%yyyy%-%mm%%dd%-%hh%%mn%%ss%")

// 同日の店舗をまとめて実行するとデータ量が多すぎるため失敗するので、まとめずに1店舗づつ繰り返す。
for(x in dateByStore) {
	// 在庫ゼロ初期化
	echoCmd(["call", ".bin\\inventory-apply-with-retry.cmd", "-d", dateByStore[x][0], "-s", x, '-z'])

	// それ以外
    for(i = 1; i < dateByStore[x].length; ++i) {
		echoCmd(["call", ".bin\\inventory-apply-with-retry.cmd", "-d", dateByStore[x][i], "-s", x])
    }
}

function echoCmd(cmd) {
	stdout.WriteLine("echo %time% >> log_%filename%.txt 2>&1")
	stdout.WriteLine(cmd.join(" ") + " >> log_%filename%.txt 2>&1")
}
