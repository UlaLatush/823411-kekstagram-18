'use strict';

(function () {

  var ESC_KEY_CODE = 27;
  var section = document.querySelector('.pictures');
  var sectionUpload = document.querySelector('.img-upload');

  function showErrorDataMessage(errorMessage) {
    var fragmentTemplate = document.querySelector('#error').content;
    var instance = fragmentTemplate.cloneNode(true);
    instance.querySelector('.error__title').textContent = errorMessage;
    section.insertBefore(instance, sectionUpload);

    // handle close events
    var errorInner = section.querySelector('.error__inner');
    var closeErrorMessage = function () {
      section.removeChild(section.querySelector('.error'));
    };

    var closeButtons = section.querySelectorAll('.error__button');

    closeButtons.forEach(function (button) {
      button.addEventListener('click', closeErrorMessage);
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.which === ESC_KEY_CODE) {
        closeErrorMessage();
      }
    });

    section.querySelector('.error').addEventListener('click', function (evt) {
      if (errorInner !== evt.target) {

        var isButton = false;
        closeButtons.forEach(function (button) {
          if (button === evt.target) {
            isButton = true;
          }
        });

        if (!isButton) {
          closeErrorMessage();
        }
      }
    });
  }

  function showSuccessUploadDataMessage() {
    var fragmentTemplate = document.querySelector('#success').content;
    var instance = fragmentTemplate.cloneNode(true);
    section.insertBefore(instance, sectionUpload);

    // handle close events
    var successInner = section.querySelector('.success__inner');
    var successButton = section.querySelector('.success__button');

    var closeSuccessMessage = function (evt) {

      // close message
      if (evt.which === ESC_KEY_CODE || evt.target === successButton) {
        section.removeChild(section.querySelector('.success'));
      } else if (evt.target !== successInner) {
        section.removeChild(section.querySelector('.success'));
      }

      // remove listeners
      successButton.removeEventListener('click', closeSuccessMessage);
      document.removeEventListener('keydown', closeSuccessMessage);
      section.removeEventListener('click', closeSuccessMessage);
    };

    // set listeners
    successButton.addEventListener('click', closeSuccessMessage);
    document.addEventListener('keydown', closeSuccessMessage);
    section.addEventListener('click', closeSuccessMessage);
  }

  window.messages = {
    showErrorDataMessage: showErrorDataMessage,
    showSuccessUploadDataMessage: showSuccessUploadDataMessage,
  };

})();

