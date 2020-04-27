(function() {

  // タイプ: 100(ツリー表示)
  Outline.SetListType(100);

  // タイトル
  Outline.SetTitle("Restructured Text");

  // 現在行
  var curLine = ''

  // 行数
  var lineCount = Editor.GetLineCount(0);

  // アウトラインの情報
  var outline = [];

  outline.add = function (row, text, level) {
    this.push({
      row: row,
      text: text,
      level: level
    });
  };

  var lv = -1

  // セクションを区切る文字
  var reHeader = /^(=|-|`|:|'|"|~|\^|_|\*|\+|#|<|>)\1+\r?\n$/; //"'

  // 区切り文字を登場した順にレベルとともに保持する。
  var sectionLevel = {}
    
  for (var no = 0; no <= lineCount; no++) {
    // // 現在の文字の文字数を取得
    // var curWidth = Editor.GetStrWidth(curLine);
    
    var nextLine  = Editor.GetLineStr(no + 1);
    var m = nextLine.match(reHeader)
    // 現在行の次の行がセクション区切り文字になっているか
    if (m) {
      if (typeof sectionLevel[m[1]] === 'undefined') {
        lv = lv + 1
        sectionLevel[m[1]] = lv
      }
      outline.add(no, curLine, sectionLevel[m[1]])
    }
    curLine = nextLine;
  }
    
  (function () {
    var level = -1;

    for (var i = 0, len = outline.length; i < len; i++) {
      var ol = outline[i];
      var req = ol.level - 1;

      for (; level < req; level++) {
        // レベルが飛んだ場合は適当な項目を補完
        Outline.AddFuncInfo2(ol.row, ol.column, "no label", level + 1);
      }

      level = ol.level;

      Outline.AddFuncInfo2(ol.row, 1, ol.text, ol.level);
    }
  })();
})();
