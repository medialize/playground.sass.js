var $ = require('jquery');

var sassModule = require('./sass');
var editors = require('./editors');

var fileList;
var editNew;
var editFile;
var editSave;
var filesystem;

/**
 * clear the selected file
 */
var clearSelected = function () {
  $('.file').removeClass('selected');
};

/**
 * use Add/Save file based on the editor's state
 */
var setSaveMessage = function (msg) {
  editSave.text(msg + ' file');
};

/**
 * set the file for the element passed as selected
 * @param {DOM Element} el the element for the file you want to mark as selected
 */
var setSelected = function (el) {
  clearSelected();
  $(el).addClass('selected');

  setSaveMessage('Save');
};

/**
 * get the DOM element of the selected file
 * @return {DOM element} selected file's DOM element
 */
var getSelectedElement = function () {
  var id = editFile.val();
  var el = document.getElementById(id);

  return el;
};

var readFile = function (fileNode) {
  setSelected(fileNode);

  editFile.val($(fileNode).data('file'));
  editors.editors.file_content.setValue($(fileNode).data('content'));
  editors.resetCursor(editors.editors.file_content);
};

var removeFile = function (fileNode) {
  sassModule.sass.removeFile($(fileNode).data('file'));
  $(fileNode).remove();

  editFile.val('');
  editors.editors.file_content.setValue('');

  clearSelected();
  setSaveMessage('Create');
}

var writeFile = function (file, content) {
  var item = document.getElementById(file);
  item = $(item);

  if (!item.length) {
    item = $('<li></li>');
    item.attr('class', 'file edit-file');
    item.attr('id', file);
    item.data('file', file);
    item.append('<i class="icon-file"></i><span class="file_title"></span><button type="button" class="error remove-file"><i class="icon-trash"></i></button>');
    item.appendTo(fileList);
  }

  item.find('.file_title').text(file);
  item.data('content', content);
  sassModule.sass.writeFile(file, content);

  return item;
};

var prepareDemo = function () {
  var demoFiles = [
    {
      name: '_variables.scss',
      content: '$brandColor: #f60;\n$size: 1em;'
    }, {
      name: '_demo.scss',
      content: '.imported {\n  content: "yay, file support!";\n}'
    }
  ];

  demoFiles.forEach(function (demoFile) {
    writeFile(demoFile.name, demoFile.content);
  });
};

var init = function () {
  fileList = $('#file_list');
  editNew = $('#new_file');
  editFile = $('#file_name');
  editSave = $('#save_file');
  filesystem = $('#filesystem');

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
      writeFile(editFile.val(), editors.editors.file_content.getValue());

      var el = getSelectedElement();

      if (el) {
        setSelected(el);
      }
    }
  });

  editNew.on('click', function (e) {
    fileList.find('.file').removeClass('selected');
    editFile.val('');
    editors.editors.file_content.setValue('');
    editors.resetCursor(editors.editors.file_content);
  });

  fileList.on('click', function (e) {
    var target = $(e.target);

    if (target.is('i') || target.is('span')) {
      target = target.parent();
    }

    if (target.hasClass('edit-file')) {
      readFile(target);
    } else if (target.hasClass('remove-file') && confirm('Are you sure you want to delete this file?')) {
      removeFile(target.parent());
    }
  });

  filesystem.on('readFile', function (e, data) {
    readFile($('[id="' + data.file + '"]'));
  });

  prepareDemo();
};

module.exports = {
  readFile: readFile,
  init: init,
  prepareDemo: prepareDemo
};
