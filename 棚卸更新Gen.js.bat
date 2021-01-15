@if(0)==(0) echo off
cscript //nologo /E:JScript "%~f0" %*
goto :EOF
@end

/**
 *
 * -------------------------------------------------------------
 * �T�v
 * -------------------------------------------------------------
 * �W�����͂���f�[�^�\�[�X��Ǎ��݁A�I���X�V�X�N���v�g��������������B
 *
 * ���I���X�V�X�N���v�g
 * �I���X�V�y�[�W�Ŏ��s�{�^�����N���b�N����B
 *
 * ���f�[�^�\�[�X�̃O���[�v��
 * �X��
 * ���I�����t
 *   ���I������ --zero-fill
 *   ������ȊO
 *
 * ���I�v�V����
 * npm run inventory -- apply --help
 *
 * -------------------------------------------------------------
 * �f�[�^�\�[�X����
 * -------------------------------------------------------------
 *   SELECT DISTINCT `date`, store
 *     FROM humpty_dumpty.invt_results
 * ORDER BY store, `date`;
 *
 * -------------------------------------------------------------
 * �I���X�V.bat����
 * -------------------------------------------------------------
 * �I���X�VGen.js.bat<�I���X�VDataSource.txt>�I���X�V.bat
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

// �����̓X�܂��܂Ƃ߂Ď��s����ƃf�[�^�ʂ��������邽�ߎ��s����̂ŁA�܂Ƃ߂���1�X�܂ÂJ��Ԃ��B
for(x in dateByStore) {
	// �݌Ƀ[��������
	echoCmd(["call", ".bin\\inventory-apply-with-retry.cmd", "-d", dateByStore[x][0], "-s", x, '-z'])

	// ����ȊO
    for(i = 1; i < dateByStore[x].length; ++i) {
		echoCmd(["call", ".bin\\inventory-apply-with-retry.cmd", "-d", dateByStore[x][i], "-s", x])
    }
}

function echoCmd(cmd) {
	stdout.WriteLine("echo %time% >> log_%filename%.txt 2>&1")
	stdout.WriteLine(cmd.join(" ") + " >> log_%filename%.txt 2>&1")
}
