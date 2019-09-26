@set @temp=0/*
@echo off
pushd "%~dp0"

cscript.exe //e:jscript //nologo "%~f0" %*

mkdir node_modules
move .\cli-6.10.3 .\node_modules\npm
copy .\node_modules\npm\bin\npm.cmd .
echo D | xcopy /e /Y .\fmbot-master .
del .gitignore README.md
rmdir /s /q fmbot-master
call "%~dp0fmbot" install

pause
goto :eof
*/

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(search, pos) {
        pos = !pos || pos < 0 ? 0 : +pos;
        return this.substring(pos, pos + search.length) === search;
    };
}

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
		return this.substring(this_len - search.length, this_len) === search;
	};
}

if (!Array.prototype.filter){
  Array.prototype.filter = function(func, thisArg) {
    'use strict';
    if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
        throw new TypeError();
   
    var len = this.length >>> 0,
        res = new Array(len), // preallocate array
        t = this, c = 0, i = -1;
    if (thisArg === undefined){
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          if (func(t[i], i, t)){
            res[c++] = t[i];
          }
        }
      }
    }
    else{
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          if (func.call(thisArg, t[i], i, t)){
            res[c++] = t[i];
          }
        }
      }
    }
   
    res.length = c; // shrink down array to proper size
    return res;
  };
}

if (!Array.prototype.map) {

  Array.prototype.map = function(callback/*, thisArg*/) {

    var T, A, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| 
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal 
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let A be a new array created as if by the expression new Array(len) 
    //    where Array is the standard built-in constructor with that name and 
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal 
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal 
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal 
        //     method of callback with T as the this value and argument 
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}

var activex = (function() {
  var fs = new ActiveXObject("Scripting.FileSystemObject");
  var shell = new ActiveXObject("WScript.Shell");
  var app = new ActiveXObject("shell.application");

  return {
    shell: shell,
    fs: fs,
    app: app
  };
})();

function unzip(options, file) {
  var dst = activex.fs.getParentFolderName(WScript.ScriptFullName);
  var folder = activex.app.NameSpace(dst);
  var zip = activex.app.NameSpace(file);
  folder.CopyHere(zip.items());
}

var HttpResponse = (function() {
  function HttpResponse(request) {
    this.request = request
    this.status = this.request.status;
    this.responseBody = this.request.responseBody;
  }

  HttpResponse.prototype.status = 0
  HttpResponse.prototype.responseBody = 0

  HttpResponse.prototype.getContentDispositionIfHasFilename = function() {
    return this.request.getResponseHeader("Content-Disposition")
             .split(' ')
             .filter(function(v) { return v.startsWith('filename') })
             .map(function(v) { return v.split('=')[1]; })
             .shift();
  }

  return HttpResponse
})();

var Http = (function() {
  function Http() {
    try {
      this.request = new ActiveXObject("Microsoft.XMLHTTP")
    } catch (e) {
      WScript.Echo("Error(" + (e.number & 0xFFFF) + "):" + e.message);
    }
  }

  Http.prototype.get = function(url, options) {
    try {
      this.request.open("GET", url, false);
      this.request.setRequestHeader( "User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64; Trident/7.0; MDDRJS; rv:11.0) like Gecko" );
      this.request.send();

      WScript.Echo(this.request.status + ":" + this.request.statusText);
      //WScript.Echo(this.request.getAllResponseHeaders());

      return new HttpResponse(this.request)
    } catch (e) {
		WScript.Echo(this.request.status)
        WScript.Echo("Error(" + (e.number & 0xFFFF) + "):" + e.message);
    }
  }

  return Http
})();

var BinaryStream = (function() {
  function BinaryStream() {
    this.stream = new ActiveXObject("ADODB.Stream")
    this.stream.Type = 1 // BINARY
  }

  BinaryStream.prototype.write = function(filename, data) {
    try {
      this.stream.Open()
      this.stream.Write(data)
      this.stream.SaveToFile(filename, 2) // SAVE CREATE OVERWRITE
      this.stream.Close()
    } catch (e) {
      WScript.Echo("Error(" + (e.number & 0xFFFF) + "):" + e.message);
    }
  }

  return BinaryStream
})();

// ファイルをダウンロードし、圧縮ファイルは展開し、元ファイルを削除する。
(function() {
  var WORKDIR = activex.fs.getParentFolderName(WScript.ScriptFullName) + '\\';
  WScript.Echo(WORKDIR);
  var stream = new BinaryStream();
  var http = new Http();
  var xs = [
    'https://codeload.github.com/GangDuo/fmbot/zip/master',
    'http://nodejs.org/dist/latest/win-x64/node.exe',
    'https://codeload.github.com/npm/cli/zip/v6.10.3'
  ];
  for(i = 0; i < xs.length; i++) {
    url = xs[i];
    WScript.Echo('Get: ' + url);
    response = http.get(url);
    if(response.status !== 200) {
      continue;
    }
    try {
      // ファイル名取得
      var separater = url.lastIndexOf('/');
      if(separater === -1) {
        throw new Error(url + " はURLではありません。");
      }
      filename = activex.fs.BuildPath(WORKDIR,
        response.getContentDispositionIfHasFilename() || url.substr(separater + 1))

      WScript.Echo("save to " + filename)
      stream.write(filename, response.responseBody)

      if(filename.endsWith('zip')) {
        unzip(null, filename);
        activex.fs.DeleteFile(filename);
      }
    } catch(err){
      WScript.Echo(err.message)
    }
  }
})();
