'use strict';

var LIKES_MIN = 15;

var LIKES_MAX = 200;

var PICTURES_AMOUNT = 25;

var ALL_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var ESC_CODE = 27;


var SCALE_DIRECTION_DOWN = 'down';
var SCALE_DIRECTION_UP = 'up';
var SCALE_STEP = 25;
var SCALE_MIN = 25;
var SCALE_MAX = 100;


// Функция возвращает рандомное целое число между min и max
function getRandomInt(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

// Функция возвращает массив комментариев.
// Кол-во комментариев в массиве определяется случайным образом от 1 до 6.
// Все комментарии в сгенерированном массиве уникальны.
// Каждый комментарий состоит из 1 предложения, взятого из массива ALL_COMMENTS
function getRandomComments() {
  var randomComments = [];
  var randomAmountComments = getRandomInt(1, ALL_COMMENTS.length);
  var allCommentsClone = ALL_COMMENTS.slice(0);
  for (var i = 1; i <= randomAmountComments; i++) {
    var randomCommentIndex = getRandomInt(0, allCommentsClone.length - 1);
    var comment = {
      message: allCommentsClone[randomCommentIndex],
    };
    allCommentsClone.splice(randomCommentIndex, 1);
    randomComments.push(comment);
  }

  return randomComments;
}

// Функция возвращает объект фотографии.
// Входящий параметр i определяет порядковый номер картинки из папки /photos.
// Кол-во лайков под фотографией определяется случаныйным образом между LIKES_MIN и LIKES_MAX.
function getPictureObject(i) {
  return {
    url: 'photos/' + i + '.jpg',
    likes: getRandomInt(LIKES_MIN, LIKES_MAX),
    comments: getRandomComments(),
  };
}

var photoData = [];
for (var i = 1; i <= PICTURES_AMOUNT; i++) {
  photoData.push(getPictureObject(i));
}

var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
var fragment = document.createDocumentFragment();
var picturesElement = document.querySelector('.pictures');

var renderPhoto = function (a) {
  var cloneNode = photoTemplate.cloneNode(true);
  cloneNode.querySelector('.picture__comments').textContent = a.comments.length;
  cloneNode.querySelector('.picture__img').setAttribute('src', a.url);
  cloneNode.querySelector('.picture__likes').textContent = a.likes;
  return cloneNode;
};

for (var j = 0; j < photoData.length; j++) {
  fragment.appendChild(renderPhoto(photoData[j]));
}

picturesElement.appendChild(fragment);

// показываем блок с классом big-picture
var bigPic = document.querySelector('.big-picture');

// bigPic.classList.remove('hidden');


// делаем функцию, которая наполняет большие фотки
var renderBiggerPhoto = function (b) {
  var iPhoto = photoData[b];
  bigPic.querySelector('.social__comment-count').textContent = iPhoto.comments.length;
  bigPic.querySelector('.big-picture__img').setAttribute('src', iPhoto.url);
  bigPic.querySelector('.social__likes').textContent = iPhoto.likes;
};

renderBiggerPhoto(0);

bigPic.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPic.querySelector('.comments-loader').classList.add('visually-hidden');

var openPhotoEditor = function () {
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
};

var closePhotoEditor = function () {
  document.querySelector('.img-upload__overlay').classList.add('hidden');
};

document.querySelector('#upload-file').addEventListener('change', openPhotoEditor);

// close editor when cancel button is pressed
document.querySelector('#upload-cancel').addEventListener('click', closePhotoEditor);

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_CODE) {
    closePhotoEditor();
  }
});

var scalePicture = function (direction) {
  var desiredScale = 0;
  var scale = document.querySelector('.scale__control--value');
  var currentScale = parseInt(scale.value.replace('%', ''), 10);

  if (direction === SCALE_DIRECTION_DOWN) {
    desiredScale = currentScale - SCALE_STEP;
  } else if (direction === SCALE_DIRECTION_UP) {
    desiredScale = currentScale + SCALE_STEP;
  }

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


// Validation
(function () {

  var TAG_NOT_UNIQUE_MSG = 'Tag {t} are not unique!';
  var TAG_WRONG_FORMAT = 'Tag {t} should start with # symbol!';
  var TAG_IS_TOO_SHORT = 'Tag {t} is to short!';
  var TAG_MIN_LEN = 1;
  var TAG_IS_TO_LONG = 'Tag {t} is to long!';
  var TAG_MAX_LEN = 20;
  var TAG_MAX_AMOUNT = 5;
  var TAG_AMOUNT_IS_TOO_MUCH = 'Total amount of tags more than ' + TAG_MAX_AMOUNT;

  window.validateTags = function (tags) {

    var arr = tags.split(' ');
    var uniques = [];
    var errors = '';

    for (var a = 0; a < arr.length; a++) {

      var tag = arr[a];
      errors = errors.length > 0 ? errors.concat(' ') : errors.concat('');

      if (uniques.includes(tag.toLowerCase())) {
        errors = errors.concat(TAG_NOT_UNIQUE_MSG.replace('{t}', tag));
      }
      uniques.push(tag.toLowerCase());

      if (!tag.startsWith('#')) {
        errors = errors.concat(TAG_WRONG_FORMAT.replace('{t}', tag));
      }

      if (tag.length <= TAG_MIN_LEN) {
        errors = errors.concat(TAG_IS_TOO_SHORT.replace('{t}', tag));
      }

      if (tag.length > TAG_MAX_LEN) {
        errors = errors.concat(TAG_IS_TO_LONG.replace('{t}', tag));
      }
    }

    if (errors.length === 0 && tags.length > TAG_MAX_AMOUNT) {
      errors = errors.concat(TAG_AMOUNT_IS_TOO_MUCH);
    }

    return errors;
  };

})();

// open big picture
document.addEventListener('click', function (evt) {
  if (evt.srcElement.classList.contains('picture__img')) {
    window.photoViewer.open(evt.srcElement.src);
  }
});

// close big picture
document.querySelector('.big-picture__cancel').addEventListener('click', window.photoViewer.close);

function findPictureByUrl(url) {

  for (var j = 0; j < window.photoData.length; j++) {
    if (url.includes(window.photoData[j].url)) {
      return window.photoData[j];
    }
  }
  return null;
}

(function () {

  function createCommentElement(comment, commentTemplate) {
    var instance = commentTemplate.cloneNode(true);
    instance.querySelector('img').setAttribute('src', comment.avatar);
    instance.querySelector('p').textContent = comment.message;
    instance.querySelector('img').setAttribute('alt', comment.name);
    return instance;
  }

  window.photoViewer = {

    open: function (url) {

      var picture = findPictureByUrl(url);
      var bigPicture = document.querySelector('.big-picture');
      bigPicture.classList.remove('hidden');
      // fill likes, comments amount and description
      bigPicture.querySelector('.big-picture__img').children[0].setAttribute('src', picture.url);
      bigPicture.querySelector('.likes-count').textContent = picture.likes;
      bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
      bigPicture.querySelector('.social__caption').textContent = picture.description;
      // add comment elements to page
      var commentsContainer = bigPicture.querySelector('.social__comments');
      var commentTemplate = commentsContainer.children[0];
      var commentsFragment = document.createDocumentFragment();
      for (var c = 0; c < picture.comments.length; c++) {
        commentsFragment.appendChild(createCommentElement(picture.comments[c], commentTemplate));
      }
      commentsContainer.innerHTML = '';
      commentsContainer.appendChild(commentsFragment);
      // hide blocks
      bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
      bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
    },
    close: function () {
      document.querySelector('.big-picture').classList.add('hidden');
    }
  };
})();
