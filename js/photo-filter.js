'use strict';

(function () {

  var AMOUNT_RANDOM_PICTURES = 10;

  var filter = document.querySelector('.img-filters');
  filter.classList.remove('img-filters--inactive');

  var sortByComments = function (first, second) {
    if (first.comments.length > second.comments.length) {
      return 1;
    } else if (first.comments.length < second.comments.length) {
      return -1;
    } else {
      return 0;
    }
  };

  function getRandomInt(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  function getRandomPictures() {

    var randomPictures = [];

    // clone original list
    var pictureListClone = window.pictureList.slice(0);

    for (var i = 1; i <= AMOUNT_RANDOM_PICTURES; i++) {

      // select random photo
      var randomPictureIndex = getRandomInt(0, pictureListClone.length - 1);
      var picture = pictureListClone[randomPictureIndex];

      // remove selected photo
      pictureListClone.splice(randomPictureIndex, 1);

      // add selected photo to result
      randomPictures.push(picture);
    }

    return randomPictures;
  }

  document.querySelector('#filter-discussed').addEventListener('click', window.photoUtils.debounce(function () {
    window.photoUtils.clearPictures();
    var pictureListClone = window.pictureList.slice(0);
    pictureListClone.sort(sortByComments);
    window.photoUtils.renderPictures(pictureListClone);
  }, 5000));

  document.querySelector('#filter-random').addEventListener('click', window.photoUtils.debounce(function () {
    window.photoUtils.clearPictures();
    window.photoUtils.renderPictures(getRandomPictures());
  }, 5000));

  document.querySelector('#filter-popular').addEventListener('click', window.photoUtils.debounce(function () {
    window.photoUtils.clearPictures();
    window.photoUtils.renderPictures(window.pictureList);
  }, 5000));

})();

