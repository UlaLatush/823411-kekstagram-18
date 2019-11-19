'use strict';

(function () {

  var ESC_KEY_CODE = 27;
  var section = document.querySelector('.pictures');
  var sectionUpload = document.querySelector('.img-upload');

  var showErrorDataMessage = function (errorMessage) {

    var fragmentTemplate = document.querySelector('#error').content;
    var instance = fragmentTemplate.cloneNode(true);
    instance.querySelector('.error__title').textContent = errorMessage;
    section.insertBefore(instance, sectionUpload);

    var closeButtons = section.querySelectorAll('.error__button');
    var errorInner = section.querySelector('.error__inner');

    var closeErrorMessage = function () {
      // close message
      section.removeChild(section.querySelector('.error'));

      // remove listeners
      closeButtons.forEach(function (button) {
        button.removeEventListener('click', onClickButtonCloseErrorMessage);
      });
      document.removeEventListener('keydown', onEscCloseErrorMessage);
      section.removeEventListener('click', onClickOutsideCloseErrorMessage);
    };

    var onClickButtonCloseErrorMessage = function () {
      closeErrorMessage();
    };

    var onEscCloseErrorMessage = function (evt) {
      if (evt.which === ESC_KEY_CODE) {
        closeErrorMessage();
      }
    };

    var onClickOutsideCloseErrorMessage = function (evt) {
      if (evt.target !== errorInner && !errorInner.contains(evt.target)) {
        closeErrorMessage();
      }
    };

    // set listeners
    closeButtons.forEach(function (button) {
      button.addEventListener('click', onClickButtonCloseErrorMessage);
    });
    document.addEventListener('keydown', onEscCloseErrorMessage);
    section.addEventListener('click', onClickOutsideCloseErrorMessage);
  };

  var showSuccessUploadDataMessage = function () {
    var fragmentTemplate = document.querySelector('#success').content;
    var instance = fragmentTemplate.cloneNode(true);
    section.insertBefore(instance, sectionUpload);

    // handle close events
    var successInner = section.querySelector('.success__inner');
    var successButton = section.querySelector('.success__button');

    var closeSuccessMessage = function () {

      // close message
      section.removeChild(section.querySelector('.success'));

      // remove listeners
      successButton.removeEventListener('click', onButtonClickCloseSuccessMessage);
      document.removeEventListener('keydown', onEscCloseSuccessMessage);
      section.removeEventListener('click', onClickOutsideCloseSuccessMessage);
    };

    var onButtonClickCloseSuccessMessage = function () {
      closeSuccessMessage();
    };

    var onEscCloseSuccessMessage = function (evt) {
      if (evt.which === ESC_KEY_CODE) {
        closeSuccessMessage();
      }
    };

    var onClickOutsideCloseSuccessMessage = function (evt) {
      if (evt.target !== successInner && !successInner.contains(evt.target)) {
        closeSuccessMessage();
      }
    };

    // set listeners
    successButton.addEventListener('click', onButtonClickCloseSuccessMessage);
    document.addEventListener('keydown', onEscCloseSuccessMessage);
    section.addEventListener('click', onClickOutsideCloseSuccessMessage);
  };

  window.messages = {
    showErrorDataMessage: showErrorDataMessage,
    showSuccessUploadDataMessage: showSuccessUploadDataMessage,
  };

})();

