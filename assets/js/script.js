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
  var editorsArr = [
    'input',
    'output',
    'sourcemap',
    'file_content'
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
};

/**
 * Attaches event listeners to the actionbar
 */
var actionbarInit = function () {
    $('#options-btn').on("click", function (e) {
      $(this).toggleClass('active');
      $('#options-wrap').toggleClass('active');
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

/**
 * initializes the Sass.js specific parts
 */
var appInit = function () {
  Sass.initialize('assets/js/sass.js/worker.js');

  function getOptions() {
    var options = {};

    var elements = $('#options input, #options select');
    elements.each(function (i, element) {
      if ($(element).attr('id').slice(0, 7) !== 'option-') {
        return;
      }

      var key = $(element).attr('id').slice(7);
      options[key] = $(element).val();
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

  var files = $('#file_list');
  var editNew = $('#new_file');
  var editFile = $('#file_name');
  var editSave = $('#save_file');

  function readFile (fileNode) {
    editFile.val($(fileNode).data('file'));
    editors.file_content.setValue($(fileNode).data('content'));
    resetCursor(editors.file_content);
  }

  function removeFile (fileNode) {
    Sass.removeFile($(fileNode).data('file'));
    $(fileNode).remove();
  }

  function writeFile (file, content) {
    var item = document.getElementById(file);
    item = $(item);

    if (!item.length) {
      item = $('<li></li>');
      item.attr('class', 'file');
      item.attr('id', file);
      item.data('file', file);
      item.append('<i class="icon-file"></i><span></span><button type="button" class="edit-file">edit</button><button type="button" class="remove-file">remove</button>');
      item.appendTo(files);
    }

    item.find('span').text(file);
    item.data('content', content);
    Sass.writeFile(file, content);
    return item;
  }

  editSave.on('click', function(e) {
    writeFile(editFile.val(), editors.file_content.getValue());
  });

  editNew.on('click', function(e) {
    editFile.val('');
    editors.file_content.setValue('');
    resetCursor(editors.file_content);
  });

  files.on('click', function(e) {
    var target = $(e.target);
    if (target.hasClass('edit-file')) {
      readFile(target.parent());
    } else if (target.hasClass('remove-file')) {
      removeFile(target.parent());
    }
  });

  var _demoFile = writeFile('demo.scss', '.imported {\n  content: "yeah, file support!";\n}');
  readFile(_demoFile);
};

var editors = {};

$(function () {
  actionbarInit();
  editorInit();
  appInit();
});
