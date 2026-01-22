import { renderHeaderComponent } from "./header-component.js";

// страница загрузки

/**
 * отображает страницу с индикатором загрузки и заголовком
 * @param {HTMLElement} params.appEl - корневой элемент приложения
 * @param {Object} params.user - объект пользователя, содержащий данные
 *                               о текущем авторизованном пользователе (если он есть)
 * @param {Function} params.goToPage - функция для навигации по страницам
 */

export function renderLoadingPageComponent({ appEl, user, goToPage }) {
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <div class="loading-page">
                  <div class="loader"><div></div><div></div><div></div></div>
                </div>
              </div>`;

  // устанавливает разметку в корневой элемент приложения
  appEl.innerHTML = appHtml;

  //  рендер заголовка с использованием компонента `renderHeaderComponent`.
  renderHeaderComponent({
    user,
    element: document.querySelector(".header-container"),
    goToPage,
  });
}
