'use strict';

(function () {
  var ESC_KEY_CODE = 27;
  var MAX_COMMENTS = 5;
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = bigPicture.querySelector('.social__comments');
  var loadCommentsButton = bigPicture.querySelector('.comments-loader');
  var closePictureButton = document.querySelector('.big-picture__cancel');
  var commentElement = socialComments.querySelector('.social__comment');
  var commentsCountElement = bigPicture.querySelector('.social__comment-count');
  var commentsCountOpened = commentsCountElement.querySelector('.comments-count-opened');
  var commentsCountMax = commentsCountElement.querySelector('.comments-count');

  var allComments = [];


  function findPictureByUrl(url) {

    for (var y = 0; y < window.pictureList.length; y++) {
      if (url.includes(window.pictureList[y].url)) {
        return window.pictureList[y];
      }
    }
    return null;
  }

  // создание одного DOM-элемента из объекта комментария
  function createCommentElement(comment) {

    var cloneCommentElement = commentElement.cloneNode(true);
    var pictureCommentElementImg = cloneCommentElement.querySelector('.social__picture');

    pictureCommentElementImg.src = comment.avatar;
    pictureCommentElementImg.alt = comment.name;
    cloneCommentElement.querySelector('.social__text').textContent = comment.message;

    return cloneCommentElement;
  }

  // создание фрагмента с заданным кол-вом комментариев
  function createCommentsFragment(comments) {
    var fragment = document.createDocumentFragment();
    comments.forEach(function (comment) {
      fragment.appendChild(createCommentElement(comment));
    });
    return fragment;
  }

  function loadComments(comments) {

    // добавляем фрагмент с новой порцией комментариев
    var amountOfLoadedComments = socialComments.querySelectorAll('.social__comment').length;
    var commentsPart = comments.slice(amountOfLoadedComments, amountOfLoadedComments + MAX_COMMENTS);
    socialComments.appendChild(createCommentsFragment(commentsPart));

    // выбираем все загруженные комментарии после добавления новой порции
    var amountOfAllLoadedComments = socialComments.querySelectorAll('.social__comment').length;

    // перерисовываем цифру кол-ва комментариев
    commentsCountOpened.textContent = amountOfAllLoadedComments;

    // скрыть кнопку загрузки комментариев, убрать слушателя по нажатию данной кнопки
    if (amountOfAllLoadedComments === comments.length) {
      loadCommentsButton.classList.add('hidden');
      loadCommentsButton.removeEventListener('click', onLoadCommentsClick);
    }
  }

  // обертка для колбека
  function onLoadCommentsClick() {
    loadComments(allComments);
  }

  // закрывает большую картинку и убирает все слушателей
  function closePhotoViewer(evt) {

    if (evt.target === closePictureButton || evt.keyCode === ESC_KEY_CODE) {

      // удаляет слушателя по загрузки пачки комментариев
      loadCommentsButton.removeEventListener('click', onLoadCommentsClick);

      // скрывает большую фотографию
      bigPicture.classList.add('hidden');

      // удаляет слушателя по закрытию на крестик
      closePictureButton.removeEventListener('click', closePhotoViewer);

      // удаляет слушателя по закрытию на Esc
      document.removeEventListener('keydown', closePhotoViewer);
    }
  }

  window.photoViewer = {

    open: function (url) {

      var picture = findPictureByUrl(url);

      // show big picture
      bigPicture.classList.remove('hidden');

      // fill likes, comments amount and description
      bigPicture.querySelector('.big-picture__img').children[0].setAttribute('src', picture.url);
      bigPicture.querySelector('.likes-count').textContent = picture.likes;
      bigPicture.querySelector('.social__caption').textContent = picture.description;

      // отобразить число всех комментариев
      commentsCountMax.textContent = picture.comments.length;

      // занулить содержимое контейнера с комментариями
      socialComments.innerHTML = '';

      // показать кнопку загрузки пачки комментариев
      loadCommentsButton.classList.remove('hidden');

      // установить массив комментариев от текущей фотографии как глобальный
      allComments = picture.comments;

      // отобразить первую пачку комментариев
      loadComments(allComments);

      // установить слушателя на кнопку загрузки следующей пачки комментариев
      loadCommentsButton.addEventListener('click', onLoadCommentsClick);

      // установить слушателя на закрытие по крестику
      closePictureButton.addEventListener('click', closePhotoViewer);

      // установить слушателя на закрытие по Esc
      document.addEventListener('keydown', closePhotoViewer);
    }
  };
})();
