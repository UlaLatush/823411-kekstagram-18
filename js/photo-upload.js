'use strict';

(function () {
  var FILE_FORMATS = ['gif', 'jpg', 'jpeg', 'png'];

  var uploadForm = document.querySelector('.img-upload__form');
  var fileChooser = uploadForm.querySelector('.img-upload__input');
  var imgPreview = uploadForm.querySelector('.img-upload__preview').querySelector('img');

  var photoUpload = function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_FORMATS.some(function (format) {
      return fileName.endsWith(format);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imgPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }

    return matches;
  };

  window.photoUpload = {
    photoUpload: photoUpload,
  };
})();
