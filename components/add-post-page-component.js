import { renderHeaderComponent } from "./header-component.js";
import { correctInput } from "../helpers.js";
import { goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";
import {
  renderUploadImageComponent,
  onImageUrlChange,
} from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // @TODO: Реализовать страницу добавления поста

    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      
    <class="form">
      <h3 class="form-title">
        Добавление поста
      </h3>

      <div class="form-inputs">
        <div id="upload-image-container">
        </div>

        <input type="text" id="description-input"
        class="input" placeholder="Добавьте описание изображения" />
      </div>

      <br />

      <button class="button" id="add-button">Добавить новый пост</button>

      <div class="form-footer">
        <p class="form-footer-title">
          Передумали?
          <button class="link-button" id="getback-button">Назад</button>
        </p>
      </div>
    </div>`;

    appEl.innerHTML = appHtml;

    renderUploadImageComponent({
      element: document.getElementById("upload-image-container"),
      onImageUrlChange,
    });

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    document.getElementById("getback-button").addEventListener("click", () => {
      goToPage(POSTS_PAGE);
    });

    document.getElementById("add-button").addEventListener("click", () => {
      // {"error":"Удалять посты с prod нельзя"}
      // const getToken = () => {
      //   const user = JSON.parse(window.localStorage.getItem("user"));
      //   const token = `Bearer ${user.token}`;
      //   return token;
      // };

      // fetch(
      //   "https://wedev-api.sky.pro/api/v1/prod/instapro/67ae4ff795358d6dbfdc63b6",
      //   {
      //     method: "DELETE",
      //     headers: {
      //       Authorization: getToken(),
      //     },
      //   }
      // );

      const imageUrl = document.getElementById("image-itself")?.src;

      if (!imageUrl) {
        alert("Добавьте изображение");
        return;
      }

      const enteredText = document.getElementById("description-input");
      let description;

      if (!enteredText.value) {
        alert("Введите описание");
        return;
      } else {
        description = correctInput(enteredText);
      }

      onAddPostClick({
        description,
        imageUrl,
      });
    });
  };

  render();
}
