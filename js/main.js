'use strict';

(function () {

  // create picture elements
  window.load(function (pictures) {

    // remember pictures
    window.pictureList = pictures;

    // render loaded pictures
    window.photoUtils.renderPictures(pictures);

    // show filters
    window.photoFilter.open();
  }, window.messages.showErrorDataMessage);

  // open big picture
  document.addEventListener('click', function (evt) {
    if (evt.srcElement.classList.contains('picture__img')) {
      window.photoViewer.open(evt.srcElement.src);
    }
  });

  // open photo editor
  document.querySelector('#upload-file').addEventListener('change', window.photoEditor.onUploadImageChange);
})();
