var $ = require('jquery');

var editors = require('./editors');

/**
* Attaches event listeners to the actionbar
*/
var init = function () {
  $('.close-options').on('click', function (e) {
    $('#options-container').toggleClass('active');
  });

  $('#options-container').on('click', function (e) {
    if (e.target != this) {
      return;
    }

    $('#options-container').toggleClass('active');
  });

  $('.close-information').on('click', function (e) {
    $('#information-container').toggleClass('active');
  });

  $('#information-container').on('click', function (e) {
    if (e.target != this) {
      return;
    }

    $('#information-container').toggleClass('active');
  });

  $('#filesystem-btn').on('click', function (e) {
    $(this).toggleClass('active');
    $('#filesystem').toggleClass('active');
    editors.resizeEditors();
  });

  $('#sourcemap-btn').on('click', function (e) {
    $(this).toggleClass('active');
    $('#sourcemap-wrap').toggleClass('active');
    editors.resizeEditors();
  });
};

module.exports = {
  init: init
};
