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

// open big picture
document.addEventListener('click', function (evt) {
  if (evt.srcElement.classList.contains('picture__img')) {
    window.photoViewer.open(evt.srcElement.src);
  }
});

// close big picture
document.querySelector('.big-picture__cancel').addEventListener('click', window.photoViewer.close);

function findPictureByUrl(url) {

  for (var y = 0; y < window.photoData.length; y++) {
    if (url.includes(window.photoData[y].url)) {
      return window.photoData[y];
    }
  }
  return null;
}

