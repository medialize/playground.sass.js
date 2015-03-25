/**
 * move cursor to the beginning of the editor's first line
 * @param  {Object} editor An ace.js editor
 */
var resetCursor = function (editor) {
    editor.selection.moveCursorFileStart();
};

/**
 * It initializes the Ace.js-based editors
 */
var editorInit = function () {
  var editors = {};

  var editorsArr = [
    'input',
    'output',
    'sourcemap',
    'filesystem-content'
  ];

  editorsArr.forEach(function (editor) {
    editors[editor] = ace.edit(editor);
    editors[editor].setTheme("ace/theme/tomorrow");
    editors[editor].getSession().setMode('ace/mode/scss');
    editors[editor].getSession().setUseWrapMode(true);
    editors[editor].$blockScrolling = Infinity;
  });

  editors.input.setValue('@import "demo";\n\n$foo: 10px;\n\n.selector {\n  margin: $foo;\n\n  .nested {\n    margin: $foo / 2;\n  }\n}');
  resetCursor(editors.input);

  return editors;
};

/**
 * Attaches event listeners to the actionbar
 */
var actionbarInit = function () {
    $('#options-btn').on("click", function (e) {
      $(this).toggleClass('active');
      $('#options').toggleClass('active');
    });

    $('#filesystem-btn').on("click", function (e) {
      $(this).toggleClass('active');
      $('#filesystem').toggleClass('active');
    });

    $('#input-output-btn').on("click", function (e) {
      $(this).toggleClass('active');
      $('#input-output').toggleClass('active');
    });
};

var appInit = function (editors) {
  Sass.initialize('assets/js/sass.js/worker.js');

  function getOptions() {
    var options = {};

    var elements = document.querySelectorAll('#options input, #options select');
    [].forEach.call(elements, function(element) {
      if (element.id.slice(0, 7) !== 'option-') {
        return;
      }

      var key = element.id.slice(7);
      options[key] = element.value;
    });

    // fix line breaks
    options.linefeed = ({
      '\\n': '\n',
      '\\r\\n': '\r\n',
    })[options.linefeed];

    return options;
  }

  var convert = $('#convert');
  var input = $('#input');
  var output = $('#output');
  var sourcemap = $('#sourcemap');

  convert.on('click', function (e) {
    convert.prop('disabled', false);

    Sass.options(getOptions(), function() {
      Sass.compile(editors.input.getValue(), function (result) {
        if (result.status) {
          var formatted = result.formatted;
          delete result.formatted;
          editors.output.setValue(formatted + '\n\n' + JSON.stringify(result, null, 2));
          editors.sourcemap.setValue('');
        } else {
          editors.output.setValue(result.text);
          editors.sourcemap.setValue(JSON.stringify(result.map, null, 2));
        }
        resetCursor(editors.output);
        resetCursor(editors.sourcemap);
      });
    });
  });
};

$(function () {
  actionbarInit();
  var editors = editorInit();
  appInit(editors);
});
