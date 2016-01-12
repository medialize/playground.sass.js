var editors = require('./editors');

var sass = window.sass = new Sass();
var $ = require('jquery');

var getOptions = function () {
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
};

/**
 * initializes the Sass.js specific parts
 */
var init = function () {
  var convert = $('#convert');

  convert.on('click', function (e) {
    convert.prop('disabled', false);

    editors.clearErrors();

    sass.options(getOptions(), function () {
      sass.compile(editors.editors.input.getValue(), function (result) {
        if (result.status) {
          if (result.file === 'stdin') {
            editors.errors.push({
              editor: editors.editors.input,
              error: editors.highlightError(editors.editors.input, result.line, result.column)
            });

            editors.editors.input.gotoLine(result.line);
          } else {
            var filesystemEl = $('#filesystem');
            filesystemEl.addClass('active');

            filesystemEl.trigger('readFile', {
              file: result.file.replace('/sass/', '')
            });

            editors.errors.push({
              editor: editors.editors.file_content,
              error: editors.highlightError(editors.editors.file_content, result.line, result.column)
            });

            editors.editors.file_content.gotoLine(result.line);
          }

          var formatted = result.formatted;
          delete result.formatted;
          editors.editors.output.setValue(formatted + '\n\n' + JSON.stringify(result, null, 2));
          editors.editors.sourcemap.setValue('');
        } else {
          editors.editors.output.setValue(result.text || '');
          editors.editors.sourcemap.setValue(JSON.stringify(result.map, null, 2));
        }
        editors.resetCursor(editors.editors.output);
        editors.resetCursor(editors.editors.sourcemap);
      });
    });
  });
};

module.exports = {
  sass: sass,
  init: init
};
