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
  }, function (errorMessage) {
    var fragmentTemplate = document.querySelector('#error').content;
    var instance = fragmentTemplate.cloneNode(true);
    instance.querySelector('.error__title').textContent = errorMessage;
    section.insertBefore(instance, sectionUpload);
  });

  // open big picture
  document.addEventListener('click', function (evt) {
    if (evt.srcElement.classList.contains('picture__img')) {
      window.photoViewer.open(evt.srcElement.src);
    }
  });

  // close big picture
  document.querySelector('.big-picture__cancel').addEventListener('click', window.photoViewer.close);
})();
