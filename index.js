import { getPosts, postsHost } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
  UPDATE_AFTER_LIKE,
} from "./routes.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];
let userId = "";

export function updatePostsArray(newData) {
  posts = newData;
}

export const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
      UPDATE_AFTER_LIKE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // роутинг на страницу авторизации, если пользователь не авторизован
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          renderApp();
        })
        .catch((error) => {
          alert(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      // получение постов пользователя из API
      page = LOADING_PAGE;
      renderApp();
      userId = data.userId;
      page = USER_POSTS_PAGE;
      posts = [];

      return renderApp();
    }

    if (newPage === UPDATE_AFTER_LIKE) {
      return renderApp();
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        // добавление поста в API
        page = LOADING_PAGE;
        renderApp();

        return fetch(postsHost, {
          method: "POST",
          headers: {
            Authorization: getToken(),
          },
          body: JSON.stringify({
            description,
            imageUrl,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Не заполнены обязательные поля");
            }
            return response.json();
          })
          .then(() => {
            alert("Новый пост добавлен!");
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            alert("Ошибка:", error.message);
          });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // страница с фотографиями отдельного пользователя

    return renderPostsPageComponent({
      appEl,
      userId,
    });
  }

  if (page === UPDATE_AFTER_LIKE) {
    return renderPostsPageComponent({
      appEl,
    });
  }
};

goToPage(POSTS_PAGE);
