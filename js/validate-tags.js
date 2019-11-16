'use strict';

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

    var uniques = [];
    var errors = '';

    // очищаем строку с тегами от начальных и конечных пробелов
    var cleanedTags = tags.trim();

    // проверка, если теги не заполнены или введены пробелы
    if (cleanedTags.length > 0) {

      // поделить всю строку тегов на части разделенные пробелом
      var tagsList = cleanedTags.split(' ');

      for (var a = 0; a < tagsList.length; a++) {

        var tag = tagsList[a];

        // между тегами могло быть больше одного пробела
        if (tag.length > 0) {

          // если уже есть ошибка, то вставляем пробел между ней и новой ошибкой
          errors = errors.length > 0 ? errors.concat(' ') : errors.concat('');

          // проверка на уникальность тега
          if (uniques.includes(tag.toLowerCase())) {
            errors = errors.concat(TAG_NOT_UNIQUE_MSG.replace('{t}', tag));
          } else {
            // запоминаем уникальный тег
            uniques.push(tag.toLowerCase());
          }

          // проверка на то что тег начинается с #
          if (!tag.startsWith('#')) {
            errors = errors.concat(TAG_WRONG_FORMAT.replace('{t}', tag));
          }

          // проверка на то что тег больше минимальной длины
          if (tag.length <= TAG_MIN_LEN) {
            errors = errors.concat(TAG_IS_TOO_SHORT.replace('{t}', tag));
          }

          // проверка на то что тег меньше максимальной длины
          if (tag.length > TAG_MAX_LEN) {
            errors = errors.concat(TAG_IS_TO_LONG.replace('{t}', tag));
          }
        } else {
          // удаляем пустой тег из массива тегов
          tagsList.splice(a, 1);
        }
      }

      // кол-во непустых тегов не должно быть больше максимального числа
      if (errors.length === 0 && tagsList.length > TAG_MAX_AMOUNT) {
        errors = errors.concat(TAG_AMOUNT_IS_TOO_MUCH);
      }
    }

    return errors;
  };

})();
