var $ = require('jquery');

var editors = {};
var errors = [];

/**
 * Makes the Ace.js editors to recalculate their dimensions
 */
var resizeEditors = function () {
  editors.list.forEach(function (editor) {
    editors[editor].resize();
  });
};

/**
 * move cursor to the beginning of the editor's first line
 * @param  {Object} editor An ace.js editor
 */
var resetCursor = function (editor) {
  editor.selection.moveCursorFileStart();
};

/**
 * clears all errors in the errors Array
 */
var clearErrors = function () {
  errors.forEach(function (item) {
    item.editor.session.removeMarker(item.error);
  });
};

/**
 * Takes a line and a column and tells Ace.js to highlight the word that triggered the Sass.js error and returns the Ace.js marker id
 */
var highlightError = function (editor, line, column) {
  var startLine = line - 1;
  var startColumn = column;
  var endLine = startLine;
  var endColumn = editor.session.getAWordRange(startLine, startColumn).end.column;

  var range = new editors.Range(startLine, startColumn, endLine, endColumn);

  return editor.session.addMarker(range, 'errorHighlight', 'text', true);
};

/**
* It initializes the Ace.js-based editors
*/
var init = function () {
  editors.Range = ace.require('ace/range').Range;

  editors.list = [
    'input',
    'output',
    'sourcemap',
    'file_content'
  ];

  editors.list.forEach(function (editor) {
    editors[editor] = ace.edit(editor);

    var session = editors[editor].getSession();

    editors[editor].setOption('fontSize', '16px');
    editors[editor].setTheme('ace/theme/tomorrow');
    session.setMode('ace/mode/scss');
    session.setUseWrapMode(true);
    editors[editor].$blockScrolling = Infinity;
  });

  editors.output.setReadOnly(true);
  editors.input.on('change', clearErrors);
  editors.file_content.on('change', clearErrors);

  editors.input.setValue('@import "_variables";\n@import "_demo";\n\n.selector {\n  margin: $size;\n  background-color: $brandColor;\n\n  .nested {\n    margin: $size / 2;\n  }\n}');
  resetCursor(editors.input);

  $(window).on('resize', resizeEditors);
};

module.exports = {
  resizeEditors: resizeEditors,
  resetCursor: resetCursor,
  clearErrors: clearErrors,
  highlightError: highlightError,
  editors: editors,
  errors: errors,
  init: init
};
