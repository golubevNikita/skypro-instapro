import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { postsHost, likeDislike } from "../api.js";
import { getUserFromLocalStorage } from "../helpers.js";
import {
  posts,
  goToPage,
  updatePostsArray,
  getToken,
  page,
  user,
} from "../index.js";

import { formatDistance } from "../node_modules/date-fns/index.js";
import { ru } from "../node_modules/date-fns/locale.js";

// рендер постов из api

export function renderPostsPageComponent({ appEl, userId }) {
  let url;

  userId ? (url = `${postsHost}/user-posts/${userId}`) : (url = postsHost);

  async function definingRequestMethod() {
    let RequestMethod;
    if (getToken()) {
      return (RequestMethod = await fetch(url, {
        headers: {
          Authorization: getToken(),
        },
      }));
    } else {
      return (RequestMethod = await fetch(url));
    }
  }

  definingRequestMethod()
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      updatePostsArray(data.posts);
      const arrayForRender = data.posts.map((el) => {
        const resultDistance = formatDistance(
          new Date(el.createdAt),
          new Date(),
          { locale: ru, addSuffix: true, includeSeconds: true }
        );

        return `<li class="post">
        <div class="post-header" data-user-id="${el.user.id}">
            <img src="${el.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${el.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${el.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${el.id}" class="like-button">
            <img src="${
              el.isLiked
                ? "./assets/images/like-active.svg"
                : "./assets/images/like-not-active.svg"
            }">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${el.likes.length}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${el.user.name}</span>
          ${el.description}
        </p>
        <p class="post-date">
          ${resultDistance}
        </p>
      </li>`;
      });

      const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>

        <ul class="posts">
          ${arrayForRender.join("")}
        </ul>

      </div>`;

      appEl.innerHTML = appHtml;
    })
    .then(() => {
      renderHeaderComponent({
        element: document.querySelector(".header-container"),
      });

      for (let likeButtonEl of document.querySelectorAll(".like-button")) {
        likeButtonEl.addEventListener("click", () => {
          if (user) {
            likeButtonEl.classList.add("loading-like");
            likeButtonEl.disabled = true;

            const postId = likeButtonEl.dataset.postId;
            const searchedPost = posts.find((postEl) => postEl.id === postId);
            let parameter;

            let isUnderscore;

            if (page === "posts") {
              isUnderscore = !searchedPost.likes.find(
                (likeInfo) => likeInfo.id === getUserFromLocalStorage()._id
              );
            }

            if (page === "user-posts") {
              isUnderscore = !searchedPost.likes.find(
                (likeInfo) => likeInfo._id === getUserFromLocalStorage()._id
              );
            }

            if (isUnderscore) {
              parameter = "like";
            } else {
              parameter = "dislike";
            }

            likeDislike(postId, parameter);
          } else {
            alert("Лайки могут ставить только авторизованные пользователи <3");
            return;
          }
        });
      }

      for (let userEl of document.querySelectorAll(".post-header")) {
        userEl.addEventListener("click", () => {
          goToPage(USER_POSTS_PAGE, {
            userId: userEl.dataset.userId,
          });
        });
      }
    });
}
