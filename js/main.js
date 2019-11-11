'use strict';

(function () {

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
})();
