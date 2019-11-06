'use strict';

(function () {

  // find initial position
  var section = document.querySelector('.pictures');
  var sectionUpload = document.querySelector('.img-upload');

  // create picture elements
  window.load(function (pictures) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pictures.length; i++) {
      var picture = pictures[i];
      var pictureElement = window.photoUtils.createPictureElement(picture);
      fragment.appendChild(pictureElement);
    }
    section.insertBefore(fragment, sectionUpload);
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
