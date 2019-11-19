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
  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var scaleControlBigger = document.querySelector('.scale__control--bigger');
  var filtersRadio = document.querySelectorAll('.effects__radio');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var uploadButton = document.querySelector('#upload-submit');

  // close photo-editor, add hidden and clear listeners
  var closePhotoEditor = function () {

    // hide photo editor window
    photoEditor.classList.add('hidden');

    // set to null all fields
    document.querySelector('#upload-file').value = null;
    document.querySelector('.text__hashtags').value = null;
    document.querySelector('.text__description').value = null;

    // remove listeners
    scaleControlSmaller.removeEventListener('click', scalePictureDown);
    scaleControlBigger.removeEventListener('click', scalePictureUp);

    filtersRadio.forEach(function (filter) {
      filter.removeEventListener('change', switchFilter);
    });

    effectLevelPin.removeEventListener('mousedown', dragPin);

    uploadButton.removeEventListener('click', sendPicture);

    closeButton.removeEventListener('click', onClickClosePhotoEditor);
    document.removeEventListener('keydown', onEscClosePhotoEditor);
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

  var scalePictureDown = function () {
    scalePicture(SCALE_DIRECTION_DOWN);
  };

  var scalePictureUp = function () {
    scalePicture(SCALE_DIRECTION_UP);
  };

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

    var sliderWidth = effectLevelPin.parentElement.offsetWidth;

    if (pinPosition > sliderWidth) {
      pinPosition = sliderWidth;
    } else if (pinPosition < 0) {
      pinPosition = 0;
    }

    effectLevelPin.style.left = pinPosition + 'px';
    var effectLevel = Math.round(effectLevelPin.offsetLeft * 100 / sliderWidth);
    document.querySelector('.effect-level__value').value = effectLevel;
    document.querySelector('.effect-level__depth').style.width = effectLevel + '%';
  };

  var switchFilter = function () {

    // change filter
    changePictureStyle();

    // change pin position and set default filter opacity value
    changePinPosition(Number.MAX_SAFE_INTEGER);

    // set default filter opacity
    changeFilterOpacity();
  };

  var dragPin = function (evt) {

    evt.preventDefault();

    var startX = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startX - moveEvt.clientX;
      var pinPosition = (effectLevelPin.offsetLeft - shiftX);

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

    // set listeners to scale controls
    scaleControlSmaller.addEventListener('click', scalePictureDown);
    scaleControlBigger.addEventListener('click', scalePictureUp);

    // set listeners to filters radio
    filtersRadio.forEach(function (filter) {
      filter.addEventListener('change', switchFilter);
    });

    // set listeners on pin
    effectLevelPin.addEventListener('mousedown', dragPin);

    // set listeners on upload button
    uploadButton.addEventListener('click', sendPicture);

    // set listeners for closing widget
    // close editor when cancel button is pressed
    closeButton.addEventListener('click', onClickClosePhotoEditor);

    // close editor when ESC key is pressed
    document.addEventListener('keydown', onEscClosePhotoEditor);
  };

  var onClickClosePhotoEditor = function (evt) {
    if (evt.target === closeButton) {
      closePhotoEditor();
    }
  };

  var onEscClosePhotoEditor = function (evt) {
    if (evt.keyCode === ESC_KEY_CODE
      && (!document.activeElement.classList.contains('text__description')
        && !document.activeElement.classList.contains('text__hashtags'))) {
      closePhotoEditor();
    }
  };

  var closePhotoEditorWithSuccessUpload = function () {
    closePhotoEditor();
    window.messages.showSuccessUploadDataMessage();
  };

  var closePhotoEditorWithErrorUpload = function (errorMessage) {
    closePhotoEditor();
    window.messages.showErrorDataMessage(errorMessage);
  };

  // validate and send to server
  var sendPicture = function (evt) {
    var tagsInput = document.querySelector('.text__hashtags');
    var errors = window.validateTags(tagsInput.value);
    if (errors) {
      tagsInput.setCustomValidity(errors);
    } else {
      window.upload(new FormData(document.querySelector('.img-upload__form')),
          closePhotoEditorWithSuccessUpload, closePhotoEditorWithErrorUpload);
      evt.preventDefault();
    }
  };

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
