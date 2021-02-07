# fmbot

## ポイント加算

多数の会員にポイント加算する方法

```powershell
npm run points -- create < file.csv
```

<div style="text-align: center;">CSVファイルフォーマット</div>

| #    | CSV項目名    | 例            |
| ---- | ------------ | ------------- |
| 1    | 会員番号     | 2700006439979 |
| 2    | 店舗コード   | 001           |
| 3    | 加算ポイント | 10            |

## 棚卸更新

メインメニュー⇨在庫・棚卸⇨棚卸⇨棚卸更新⇨実行

### コマンド

.bin\inventory-apply-with-retry.cmd 

### オプション


| 短いオプション | 長いオプション            | 説明                                      |
| -------------- | ------------------------- | ----------------------------------------- |
| -z             | --zero-fill               | 実棚にないSKU在庫数量を0にする            |
| -d \<date\>      | --stocktaking-date \<date\> | 棚卸日                                    |
| -s \<codes\>     | --store-codes \<codes\>     | 「,」区切りの店舗コード<br>commaSeparatedList |

### 使用例

```powershell
.bin\inventory-apply-with-retry.cmd -d 2000-01-01 -s 001 -z
```

### ヘルパー

#### 棚卸更新Gen.js.bat

棚卸更新コマンドをキーボード入力することはない。なぜなら、店舗の数だけ棚卸更新コマンドを実行する必要があるため。この作業を軽減するためのスクリプト。

##### 使用方法

`棚卸更新Gen.js.bat < DataSource.tsv > run.bat`

<div style="text-align: center;">TSVファイルフォーマット</div>


| #    | 項目名     | 例         |
| ---- | ---------- | ---------- |
| 1    | 棚卸日     | 2020-11-30 |
| 2    | 店舗コード | 001        |

ヘッダ行なしでTSVを作成する。

## 取引先エクスポート

メインメニュー⇨マスター⇨各種マスター⇨仕入先マスター⇨照会

### コマンド

npm run supplier -- export

### オプション

| 短いオプション | 長いオプション    | 説明                                   |
| -------------- | ----------------- | -------------------------------------- |
| -o \<file\>    | --output \<file\> | 標準出力ではなく\<file\>に出力します。 |

### 使用例

```powershell
npm run supplier -- export -o "C:\suppliers.txt"
```

