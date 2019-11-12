'use strict';

(function () {
  var ESC_KEY_CODE = 27;

  // create picture elements
  window.load(function (pictures) {

    // remember pictures
    window.pictureList = pictures;

    window.photoUtils.renderPictures(pictures);
  }, window.messages.showErrorDataMessage);

  // open big picture
  document.addEventListener('click', function (evt) {
    if (evt.srcElement.classList.contains('picture__img')) {
      window.photoViewer.open(evt.srcElement.src);
    }
  });

  // close big picture
  document.querySelector('.big-picture__cancel').addEventListener('click', window.photoViewer.close);
  document.addEventListener('keydown', function (evt) {
    if (evt.which === ESC_KEY_CODE) {
      window.photoViewer.close();
    }
  });
})();
