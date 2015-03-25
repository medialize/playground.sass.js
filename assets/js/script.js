Sass.initialize('assets/libs/sass.js/dist/worker.min.js');

var convert = document.getElementById('convert');
var input = document.getElementById('input');
var output = document.getElementById('output');
var sourcemap = document.getElementById('sourcemap');

convert.addEventListener('click', function (event) {
  event.preventDefault();
  convert.disabled = false;
  Sass.options(getOptions(), function() {
    Sass.compile(input.value, function (result) {
      if (result.status) {
        var formatted = result.formatted;
        delete result.formatted;
        output.value = formatted + '\n\n' + JSON.stringify(result, null, 2);
        sourcemap.value = '';
      } else {
        output.value = result.text;
        sourcemap.value = JSON.stringify(result.map, null, 2);
      }

    });
  })
}, false);

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
  })[options.linefeed]

  return options;
}

var files = document.getElementById('filesystem-list');
var editNew = document.getElementById('filesystem-new');
var editFile = document.getElementById('filesystem-file');
var editContent = document.getElementById('filesystem-content');
var editSave = document.getElementById('filesystem-save');

files.addEventListener('click', function(event) {
  if (event.target.classList.contains('filesystem-edit')) {
    readFile(event.target.parentNode);
  } else if (event.target.classList.contains('filesystem-remove')) {
    removeFile(event.target.parentNode)
  }
});

editSave.addEventListener('click', function(event) {
  writeFile(editFile.value, editContent.value);
});

editNew.addEventListener('click', function(event) {
  editFile.value = '';
  editContent.value = '';
});

function readFile(fileNode) {
  editFile.value = fileNode.getAttribute('data-file');
  editContent.value = fileNode.getAttribute('data-content');
}

function removeFile(fileNode) {
  Sass.removeFile(fileNode.getAttribute('data-file'));
  fileNode.parentNode.removeChild(fileNode);
}

function writeFile(file, content) {
  var item = document.getElementById('filesystem--' + file);
  if (!item) {
    item = document.createElement('li');
    item.id = 'filesystem--' + file;
    item.setAttribute('data-file', file);
    item.innerHTML = '<span></span><button type="button" class="filesystem-edit">edit</button><button type="button" class="filesystem-remove">remove</button>';
    files.insertBefore(item, files.firstElementChild);
  }

  item.firstElementChild.textContent = file;
  item.setAttribute('data-content', content);
  Sass.writeFile(file, content);
  return item;
}

var _demoFile = writeFile('demo.scss', '.imported { content: "yeah, file support!"; }');
readFile(_demoFile);

$(function () {
    var options = $('#options');
    var inputOutput = $('#input-output');
    var filesystem = $('#filesystem');

    var optionsBtn = $('#options-btn');
    var inputOutputBtn = $('#input-output-btn');
    var filesystemBtn = $('#filesystem-btn');

    optionsBtn.on("click", function (e) {
      $(this).toggleClass('active');
      options.toggleClass('active');
    });

    filesystemBtn.on("click", function (e) {
      $(this).toggleClass('active');
      filesystem.toggleClass('active');
    });

    inputOutputBtn.on("click", function (e) {
      $(this).toggleClass('active');
      inputOutput.toggleClass('active');
    });
});
