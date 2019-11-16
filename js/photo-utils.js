'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  // obtain picture template
  var pictureTemplate = document.querySelector('#picture').content;

  window.photoUtils = {
    createPictureElement: function (pictute) {
      var instance = pictureTemplate.cloneNode(true);
      var img = instance.querySelector('img');
      img.src = pictute.url;
      img.alt = pictute.description;
      instance.querySelector('.picture__comments').textContent = pictute.comments.length;
      instance.querySelector('.picture__likes').textContent = pictute.likes;
      return instance;
    },

    renderPictures: function (pictures) {
      // find initial position
      var section = document.querySelector('.pictures');
      var sectionUpload = document.querySelector('.img-upload');

      var fragment = document.createDocumentFragment();
      for (var i = 0; i < pictures.length; i++) {
        var picture = pictures[i];
        var pictureElement = window.photoUtils.createPictureElement(picture);
        fragment.appendChild(pictureElement);
      }
      section.insertBefore(fragment, sectionUpload);
    },

    clearPictures: function () {
      var pictures = document.querySelectorAll('.picture');
      pictures.forEach(function (pic) {
        pic.remove();
      });
    },

    debounce: function (cb) {
      var lastTimeout = null;
      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          clearTimeout(lastTimeout);
        }
        lastTimeout = setTimeout(function () {
          cb.apply(null, parameters);
        }, DEBOUNCE_INTERVAL);
      };
    }

  };

})();
