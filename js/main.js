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
bigPic.classList.remove('hidden');


// делаем функцию, которая наполняет большие фотки???
var renderBiggerPhoto = function (b) {
  var iPhoto = photoData[i];
  bigPic.querySelector('.social__comment-count').textContent = iPhoto.comments.length;
  bigPic.querySelector('.big-picture__img').setAttribute('src', iPhoto.url);
  bigPic.querySelector('.social__likes').textContent = iPhoto.likes;
};

renderBiggerPhoto(0);

bigPic.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPic.querySelector('.comments-loader').classList.add('visually-hidden');
