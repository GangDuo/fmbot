function CopyValueToEndOfRowIfHasPayload(wsSource, wsDestination) {
    if (0 === wsSource.Cells(2, 1).Text.Length)
    {
        // データなし
        return;
    }
    var srcRowMax = wsSource.Cells(1, 1).End(xlDown).Row;
    var srcClmMax = wsSource.Cells(1, 1).End(xlToRight).Column;

    var dstRowMax = wsDestination.Cells(wsDestination.Rows.Count, 1).End(xlUp).Row;
    var dstClmMax = srcClmMax;
    var srcRow = 2;
    var rowCount = (srcRowMax - 1) - 1;// ヘッダと先頭行自身を削除

    if (0 === wsDestination.Cells(1, 1).Text.length) {
        srcRow = 1;
        dstRowMax = 0;
        rowCount = srcRowMax - 1;
    }
    var dstR = dstRowMax + 1;
    // 書式設定を文字列へ
    wsDestination.Range(wsDestination.Cells(dstR, 1), wsDestination.Cells(dstR + rowCount, srcClmMax)).NumberFormatLocal = "@";

    // 値貼り付け
    wsDestination.Range(wsDestination.Cells(dstR, 1), wsDestination.Cells(dstR + rowCount, srcClmMax)).Value
        = wsSource.Range(wsSource.Cells(srcRow, 1), wsSource.Cells(srcRowMax, srcClmMax)).Value;
}

function MergeMultipleExcelsIntoSingleSheet(file) {
  var ExcelApp,
      bookSrc,
      bookDest,
      source;

  try {
    ExcelApp = WScript.CreateObject("Excel.Application");
    ExcelApp.DisplayAlerts = false;

    bookDest = file ? ExcelApp.Workbooks.Open(file) : ExcelApp.Workbooks.Add();

    while (!WScript.StdIn.AtEndOfStream) {
      try {
        source = WScript.StdIn.ReadLine()
        WScript.StdOut.WriteLine('Open the ' + source);
        bookSrc = ExcelApp.Workbooks.Open(source);
        CopyValueToEndOfRowIfHasPayload(bookSrc.Worksheets(1), bookDest.Worksheets(1))
      } catch (e) {
        WScript.StdErr.WriteLine(e.message);
      } finally {
        try {
          bookSrc.Close()
        } catch (e) {
          WScript.StdErr.WriteLine(e.message);
        }
      }
    }
  } catch (e) {
    WScript.StdErr.WriteLine(e.message);
  } finally {
    ExcelApp.Visible = true;
    try {
      //bookDest.Save();
      //ExcelApp.Quit()
    } catch (e) {
      WScript.StdErr.WriteLine(e.message);
    }
  }
}

(function () {
  var file = WScript.Arguments.Named.Item("file")
  WScript.StdOut.WriteLine('Output destination: ' + file)
  MergeMultipleExcelsIntoSingleSheet(file)
})();