'use strict';

(function () {

  var AMOUNT_RANDOM_PICTURES = 10;
  var DEBOUNCE_INTERVAL = 500;

  var filter = document.querySelector('.img-filters');

  var open = function () {
    filter.classList.remove('img-filters--inactive');
  };

  window.photoFilter = {
    open: open
  };

  var sortByComments = function (first, second) {
    if (first.comments.length > second.comments.length) {
      return 1;
    } else if (first.comments.length < second.comments.length) {
      return -1;
    } else {
      return 0;
    }
  };

  var getRandomInt = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var getRandomPictures = function () {

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
  };

  var activeButtonToggle = function (button) {
    var activeButton = filter.querySelector('.img-filters__button--active');
    activeButton.classList.remove('img-filters__button--active');
    button.classList.add('img-filters__button--active');
  };

  document.querySelector('#filter-discussed').addEventListener('click', window.photoUtils.debounce(function (evt) {
    activeButtonToggle(evt.target);
    window.photoUtils.clearPictures();
    var pictureListClone = window.pictureList.slice(0);
    pictureListClone.sort(sortByComments);
    window.photoUtils.renderPictures(pictureListClone);
  }, DEBOUNCE_INTERVAL));

  document.querySelector('#filter-random').addEventListener('click', window.photoUtils.debounce(function (evt) {
    activeButtonToggle(evt.target);
    window.photoUtils.clearPictures();
    window.photoUtils.renderPictures(getRandomPictures());
  }, DEBOUNCE_INTERVAL));

  document.querySelector('#filter-popular').addEventListener('click', window.photoUtils.debounce(function (evt) {
    activeButtonToggle(evt.target);
    window.photoUtils.clearPictures();
    window.photoUtils.renderPictures(window.pictureList);
  }, DEBOUNCE_INTERVAL));

})();

