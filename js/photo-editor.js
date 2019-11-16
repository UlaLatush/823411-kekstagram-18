'use strict';

(function () {

  var ESC_KEY_CODE = 27;

  var SCALE_DEFAULT = 100;
  var SCALE_DIRECTION_DOWN = 'down';
  var SCALE_DIRECTION_UP = 'up';
  var SCALE_STEP = 25;
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;

  var FILTER_STYLE_PREFIX = 'effects__preview--';
  var FILTER_DEFAULT = 'none';

  var photoEditor = document.querySelector('.img-upload__overlay');
  var closeButton = document.querySelector('#upload-cancel');

  // close photo-editor, add hidden and clear listeners
  var closePhotoEditor = function () {
    if (
      !document.activeElement.classList.contains('text__description')
      && !document.activeElement.classList.contains('text__hashtags')
    ) {
      photoEditor.classList.add('hidden');
      document.querySelector('#upload-file').value = null;
      document.querySelector('.text__hashtags').value = null;
      document.querySelector('.text__description').value = null;

      // remove listeners
      closeButton.removeEventListener('click', closePhotoEditor);
      document.removeEventListener('keydown', closePhotoEditor);
    }
  };

  var scalePicture = function (direction) {
    var desiredScale = 0;
    var scale = document.querySelector('.scale__control--value');
    var currentScale = parseInt(scale.value.replace('%', ''), 10);

    desiredScale = currentScale + ((direction === SCALE_DIRECTION_DOWN) ? -SCALE_STEP : SCALE_STEP);

    if (desiredScale >= SCALE_MIN && desiredScale <= SCALE_MAX) {
      resizePicture(desiredScale);
    }
  };

  // change scale
  document.querySelector('.scale__control--smaller').addEventListener('click', function () {
    scalePicture(SCALE_DIRECTION_DOWN);
  });
  document.querySelector('.scale__control--bigger').addEventListener('click', function () {
    scalePicture(SCALE_DIRECTION_UP);
  });

  // set picture scale
  var resizePicture = function (scale) {
    document.querySelector('.scale__control--value').value = scale + '%';
    document.querySelector('.img-upload__preview').style.transform = 'scale(' + scale / 100 + ')';
  };

  // change style of editing picture
  var changePictureStyle = function () {

    var classes = document.querySelector('.img-upload__preview').classList;
    var selectedEffect = document.querySelector('input[name="effect"]:checked').value;

    for (var c = 0; c < classes.length; c++) {
      if (classes.item(c).startsWith(FILTER_STYLE_PREFIX)) {
        classes.remove(classes.item(c));
      }
    }
    classes.add(FILTER_STYLE_PREFIX + selectedEffect);

    if (selectedEffect === FILTER_DEFAULT) {
      document.querySelector('.img-upload__effect-level').classList.add('visually-hidden');
    } else {
      document.querySelector('.img-upload__effect-level').classList.remove('visually-hidden');
    }
  };

  // change filter opacity
  var changeFilterOpacity = function () {

    var imgPreview = document.querySelector('.img-upload__preview');
    var selectedEffect = document.querySelector('input[name="effect"]:checked').value;
    var effectLevel = document.querySelector('.effect-level__value').value;

    if (selectedEffect === 'chrome') {
      imgPreview.style.filter = 'grayscale(' + effectLevel / 100 + ')';
    } else if (selectedEffect === 'sepia') {
      imgPreview.style.filter = 'sepia(' + effectLevel / 100 + ')';
    } else if (selectedEffect === 'marvin') {
      imgPreview.style.filter = 'invert(' + effectLevel + '%)';
    } else if (selectedEffect === 'phobos') {
      imgPreview.style.filter = 'blur(' + Math.trunc(effectLevel / 100 * 3) + 'px)';
    } else if (selectedEffect === 'heat') {
      var truncatedVal = Math.trunc(effectLevel / 100 * 3);
      imgPreview.style.filter = 'brightness(' + (truncatedVal === 0 ? 1 : truncatedVal) + ')';
    } else {
      imgPreview.style.filter = 'none';
    }
  };

  var changePinPosition = function (pinPosition) {

    var sliderWidth = pin.parentElement.offsetWidth;

    if (pinPosition > sliderWidth) {
      pinPosition = sliderWidth;
    } else if (pinPosition < 0) {
      pinPosition = 0;
    }

    pin.style.left = pinPosition + 'px';
    var effectLevel = Math.round(pin.offsetLeft * 100 / sliderWidth);
    document.querySelector('.effect-level__value').value = effectLevel;
    document.querySelector('.effect-level__depth').style.width = effectLevel + '%';
  };

  var openPhotoEditor = function () {

    // set default scale
    resizePicture(SCALE_DEFAULT);

    // set default filter
    document.querySelector('#effect-none').checked = true;
    changePictureStyle();

    // change pin position and set default filter opacity value
    changePinPosition(Number.MAX_SAFE_INTEGER);

    // set filter opacity
    changeFilterOpacity();

    // open widget
    photoEditor.classList.remove('hidden');

    // set listeners for closing widget
    // close editor when cancel button is pressed
    closeButton.addEventListener('click', closePhotoEditor);

    // close editor when ESC key is pressed
    document.addEventListener('keydown', function (evt) {
      if (evt.which === ESC_KEY_CODE) {
        closePhotoEditor();
      }
    });
  };

  // add listeners to switch filters
  var radios = document.querySelectorAll('.effects__radio');
  for (var k = 0; k < radios.length; k++) {
    radios[k].addEventListener('change', function () {

      // change filter
      changePictureStyle();

      // change pin position and set default filter opacity value
      changePinPosition(Number.MAX_SAFE_INTEGER);

      // set default filter opacity
      changeFilterOpacity();
    });
  }

  // drag pin
  var pin = document.querySelector('.effect-level__pin');
  pin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startX = evt.clientX;


    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startX - moveEvt.clientX;
      var pinPosition = (pin.offsetLeft - shiftX);

      changePinPosition(pinPosition);

      startX = moveEvt.clientX;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();


      changeFilterOpacity();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var closePhotoEditorWithSuccessUpload = function () {
    closePhotoEditor();
    window.messages.showSuccessUploadDataMessage();
  };

  var closePhotoEditorWithErrorUpload = function (errorMessage) {
    closePhotoEditor();
    window.messages.showErrorDataMessage(errorMessage);
  };

  // validate and send to server
  document.querySelector('#upload-submit').addEventListener('click', function (evt) {

    var tagsInput = document.querySelector('.text__hashtags');
    var errors = window.validateTags(tagsInput.value);
    if (errors) {
      tagsInput.setCustomValidity(errors);
    } else {
      window.upload(new FormData(document.querySelector('.img-upload__form')),
          closePhotoEditorWithSuccessUpload, closePhotoEditorWithErrorUpload);
      evt.preventDefault();
    }
  });

  var onUploadImageChange = function () {
    if (window.photoUpload.photoUpload()) {
      openPhotoEditor();
    } else {
      window.popup.showErrorDataMessage('Неправильный формат изображения');
    }
  };

  window.photoEditor = {
    onUploadImageChange: onUploadImageChange,
  };

})();
