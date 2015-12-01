/**
 * move cursor to the beginning of the editor's first line
 * @param  {Object} editor An ace.js editor
 */
var resetCursor = function (editor) {
  editor.selection.moveCursorFileStart();
};

/**
 * Makes the Ace.js editors to recalculate their dimensions
 */
var resizeEditors = function () {
  editors.list.forEach(function (editor) {
    editors[editor].resize();
  });
};

/**
 * It initializes the Ace.js-based editors
 */
var editorInit = function () {
  editors.list = [
    'input',
    'output',
    'sourcemap',
    'file_content'
  ];

  editors.list.forEach(function (editor) {
    editors[editor] = ace.edit(editor);
    editors[editor].setOption('fontSize', '16px');
    editors[editor].setTheme('ace/theme/tomorrow');
    editors[editor].getSession().setMode('ace/mode/scss');
    editors[editor].getSession().setUseWrapMode(true);
    editors[editor].$blockScrolling = Infinity;
  });

  editors.input.setValue('@import "_variables";\n@import "_demo";\n\n.selector {\n  margin: $size;\n  background-color: $brandColor;\n\n  .nested {\n    margin: $size / 2;\n  }\n}');
  resetCursor(editors.input);
};

/**
 * Attaches event listeners to the actionbar
 */
var actionbarInit = function () {
  $('#options-btn').on('click', function (e) {
      $('.playground').first().toggle();

      $(this).toggleClass('active');
      $('#options-wrap').toggleClass('active');
      resizeEditors();
    });

  $('#filesystem-btn').on('click', function (e) {
      $(this).toggleClass('active');
      $('#filesystem').toggleClass('active');
      resizeEditors();
    });

  $('#sourcemap-btn').on('click', function (e) {
      $(this).toggleClass('active');
      $('#sourcemap-wrap').toggleClass('active');
      resizeEditors();
    });
};

/**
 * initializes the Sass.js specific parts
 */
var appInit = function () {
  var sass = window.sass = new Sass();

  function getOptions () {
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
      '\\r\\n': '\r\n'
    })[options.linefeed];

    return options;
  }

  var convert = $('#convert');
  var input = $('#input');
  var output = $('#output');
  var sourcemap = $('#sourcemap');

  convert.on('click', function (e) {
    convert.prop('disabled', false);

    sass.options(getOptions(), function () {
      sass.compile(editors.input.getValue(), function (result) {
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

  function clearSelected () {
    $('.file').removeClass('selected');
  }

  function setSelected (el) {
    clearSelected();
    $(el).addClass('selected');

    setSaveMessage('Save');
  }

  function setSaveMessage (msg) {
    editSave.text(msg + ' file');
  }

  function getSelectedElement () {
    var id = editFile.val();
    var el = document.getElementById(id);

    return el;
  }

  function readFile (fileNode) {
    setSelected(fileNode);

    editFile.val($(fileNode).data('file'));
    editors.file_content.setValue($(fileNode).data('content'));
    resetCursor(editors.file_content);
  }

  function removeFile (fileNode) {
    sass.removeFile($(fileNode).data('file'));
    $(fileNode).remove();

    editFile.val('');
    editors.file_content.setValue('');

    clearSelected();
    setSaveMessage('Create');
  }

  function writeFile (file, content) {
    var item = document.getElementById(file);
    item = $(item);

    if (!item.length) {
      item = $('<li></li>');
      item.attr('class', 'file');
      item.attr('id', file);
      item.data('file', file);
      item.append('<i class="icon-file"></i><span class="file_title"></span><button type="button" class="warning edit-file"><i class="icon-pencil"></i></button><button type="button" class="error remove-file"><i class="icon-trash"></i></button>');
      item.appendTo(files);
    }

    item.find('.file_title').text(file);
    item.data('content', content);
    sass.writeFile(file, content);
    return item;
  }

  editFile.on('input', function (e) {
    var el = getSelectedElement();

    if (el) {
      setSelected(el);
    } else {
      clearSelected();
      setSaveMessage('Create');
    }
  });

  editSave.on('click', function (e) {
    if (editFile.val()) {
      writeFile(editFile.val(), editors.file_content.getValue());

      var el = getSelectedElement();

      if (el) {
        setSelected(el);
      }
    }
  });

  editNew.on('click', function (e) {
    editFile.val('');
    editors.file_content.setValue('');
    resetCursor(editors.file_content);
  });

  files.on('click', function (e) {
    var target = $(e.target).is('button') ? $(e.target) : $(e.target).parent('button');

    if (target.hasClass('edit-file')) {
      readFile(target.parent());
    } else if (target.hasClass('remove-file') && confirm('Are you sure you want to delete this file?')) {
      removeFile(target.parent());
    }
  });

  var demoFiles = [{
      name: '_variables.scss',
      content: '$brandColor: #f60;\n$size: 1em;'
    }, {
      name: '_demo.scss',
      content: '.imported {\n  content: "yay, file support!";\n}'
    }];

  demoFiles.forEach(function (demoFile) {
      var demoItem = writeFile(demoFile.name, demoFile.content);
    });
};

var editors = {};

$(function () {
  actionbarInit();
  editorInit();
  appInit();

  // would be nice to debounce this in the future
  $(window).on('resize', resizeEditors);
});
