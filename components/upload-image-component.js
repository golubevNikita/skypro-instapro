import { uploadImage } from "../api.js";

//  страница загрузки изображения

/**
 * позволяет пользователю загружать изображение и отображать его превью.
 * Если изображение уже загружено, пользователь может заменить его
 *
 * @param {HTMLElement} params.element - HTML-элемент, в который будет рендериться компонент
 * @param {Function} params.onImageUrlChange - функция, вызываемая при изменении URL изображения.
 *                                            Принимает новый URL изображения или пустую строку
 */

export function onImageUrlChange(imageUrl) {
  if ((imageUrl = "")) {
    return;
  }

  alert("Изображение изменено");
}

export function renderUploadImageComponent({ element, onImageUrlChange }) {
  /**
   * URL текущего изображения.
   * Изначально пуст, пока пользователь не загрузит изображение
   * @type {string}
   */
  let imageUrl = "";

  //  отображает либо форму выбора файла, либо превью загруженного изображения с кнопкой замены
  const render = () => {
    element.innerHTML = `
      <div class="upload-image">
        ${
          imageUrl
            ? `
            <div class="file-upload-image-container">
              <img id="image-itself" class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение">
              <button class="file-upload-remove-button button">Заменить фото</button>
            </div>
            `
            : `
            <label class="file-upload-label secondary-button">
              <input
                type="file"
                class="file-upload-input"
                style="display:none"
              />
              Выберите фото
            </label>
          `
        }
      </div>
    `;

    // обработчик выбора файла
    const fileInputElement = element.querySelector(".file-upload-input");
    fileInputElement?.addEventListener("change", () => {
      const file = fileInputElement.files[0];
      if (file) {
        const labelEl = document.querySelector(".file-upload-label");
        labelEl.setAttribute("disabled", true);
        labelEl.textContent = "Загружаю файл...";

        // загружает изображение с помощью API
        uploadImage({ file }).then(({ fileUrl }) => {
          imageUrl = fileUrl; // сохраняет URL загруженного изображения
          onImageUrlChange(imageUrl); // уведомляет об изменении URL изображения
          render();
        });
      }
    });

    // обработчик удаления изображения
    element
      .querySelector(".file-upload-remove-button")
      ?.addEventListener("click", () => {
        imageUrl = ""; // сбрасывает URL изображения
        onImageUrlChange(imageUrl); // уведомляет об изменении URL изображения
        render();
      });
  };

  render();
}
